import os
import openai
import requests
import sqlite3
import ast
import re

from flask import Flask
from flask import jsonify, request
from flask_cors import CORS

from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.agent_toolkits import create_sql_agent
from langchain.agents.agent_toolkits import create_retriever_tool
from langchain_community.utilities import SQLDatabase
from langchain.callbacks.base import BaseCallbackHandler

from langchain_community.vectorstores import FAISS
from langchain_core.example_selectors import SemanticSimilarityExampleSelector
from langchain_core.prompts import (
    ChatPromptTemplate,
    FewShotPromptTemplate,
    MessagesPlaceholder,
    PromptTemplate,
    SystemMessagePromptTemplate,
)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://db-bot.vercel.app/"}})

db = SQLDatabase.from_uri('sqlite:///database.sqlite')

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0, api_key=OPENAI_API_KEY)
agent_executor = create_sql_agent(llm, db=db, agent_type="openai-tools", verbose=True)

class SQLHandler(BaseCallbackHandler):
    def __init__(self):
        self.sql_result = None

    def on_agent_action(self, action, **kwargs):
        """Run on agent action. if the tool being used is sql_db_query,
         it means we're submitting the sql and we can 
         record it as the final sql"""

        if action.tool == "sql_db_query":
            self.sql_result = action.tool_input

def read_sql_query(sql, db):
    conn = sqlite3.connect(db)
    cur = conn.cursor()
    cur.execute(sql)
    rows = cur.fetchall()
    for row in rows:
        print(row)
    conn.close()

def query_as_list(db, query):
    res = db.run(query)
    res = [el for sub in ast.literal_eval(res) for el in sub if el]
    res = [re.sub(r"\b\d+\b", "", string).strip() for string in res]
    return list(set(res))

batting_hand = query_as_list(db, "SELECT Batting_hand FROM Batting_Style")
bowling_skill = query_as_list(db, "SELECT Bowling_skill FROM Bowling_Style")
city_name = query_as_list(db, "SELECT City_Name FROM City")
team_name = query_as_list(db, "SELECT Team_Name FROM Team")
venue_name = query_as_list(db, "SELECT Venue_Name FROM Venue")
country_name = query_as_list(db, "SELECT Country_Name FROM Country")
extra_type = query_as_list(db, "SELECT Extra_Name FROM Extra_Type")
out_type = query_as_list(db, "SELECT Out_Name FROM Out_Type")
outcome_type = query_as_list(db, "SELECT Outcome_Type FROM Outcome")
player_name = query_as_list(db, "SELECT Player_Name FROM Player")

context = db.get_context()
table_info=context["table_info"]

examples = [
    {
        "input": "Find the player with the highest average runs per match across multiple seasons.",
        "query": "SELECT Player.Player_Name, AVG(Batsman_Scored.Runs_Scored) as Average_Runs FROM Player INNER JOIN Player_Match ON Player.Player_Id = Player_Match.Player_Id INNER JOIN Batsman_Scored ON Player_Match.Match_Id = Batsman_Scored.Match_Id AND Player.Player_Id = Player_Match.Player_Id GROUP BY Player.Player_Name ORDER BY Average_Runs DESC LIMIT 1;"
    },
    {
        "input": "List all players who have played in more than three teams throughout their career.",
        "query": "SELECT Player.Player_Name FROM Player INNER JOIN Player_Match ON Player.Player_Id = Player_Match.Player_Id GROUP BY Player.Player_Name HAVING COUNT(DISTINCT Player_Match.Team_Id) > 3;"
    },
    {
        "input": "Find the match with the most extra runs scored.",
        "query": "SELECT Match_Id, SUM(Extra_Runs) as Total_Extra_Runs FROM Extra_Runs GROUP BY Match_Id ORDER BY Total_Extra_Runs DESC LIMIT 1;"
    },
    {
        "input": "Identify matches where the 'Man of the Match' scored more than 50 runs and took at least 3 wickets.",
        "query": "SELECT Match.Match_Id FROM Match INNER JOIN Batsman_Scored ON Match.Match_Id = Batsman_Scored.Match_Id INNER JOIN Wicket_Taken ON Match.Match_Id = Wicket_Taken.Match_Id WHERE Match.Man_of_the_Match IN (SELECT Player_Id FROM Player_Match WHERE Player_Id IN (SELECT Player_Id FROM Batsman_Scored WHERE Runs_Scored > 50)) AND Wicket_Taken.Player_Out IN (SELECT Player_Id FROM Player_Match WHERE Player_Id = Match.Man_of_the_Match) GROUP BY Match.Match_Id HAVING COUNT(Wicket_Taken.Player_Out) >= 3;"
    },
    {
        "input": "Calculate the total number of matches played by each player, considering both batting and bowling.",
        "query": "SELECT Player.Player_Name, COUNT(DISTINCT Player_Match.Match_Id) as Total_Matches FROM Player INNER JOIN Player_Match ON Player.Player_Id = Player_Match.Player_Id GROUP BY Player.Player_Name;"
    },
    {
        "input": "Find the teams that have won at least one match in every season.",
        "query": "SELECT Team.Team_Name FROM Team WHERE Team.Team_Id IN (SELECT Match.Match_Winner FROM Match GROUP BY Match.Season_Id, Match.Match_Winner HAVING COUNT(*) >= 1);"
    },
    {
        "input": "Find the most common bowling skill among players who have taken at least 100 wickets.",
        "query": "SELECT Bowling_Style.Bowling_skill, COUNT(*) as Frequency FROM Player INNER JOIN Bowling_Style ON Player.Bowling_skill = Bowling_Style.Bowling_Id INNER JOIN Wicket_Taken ON Player.Player_Id = Wicket_Taken.Player_Out GROUP BY Bowling_Style.Bowling_skill HAVING COUNT(*) >= 100 ORDER BY Frequency DESC LIMIT 1;"
    },
    {
        "input": "List all matches where the toss decision was to bat first, and the team that won the toss also won the match.",
        "query": "SELECT Match_Id FROM Match WHERE Toss_Decide = (SELECT Toss_Id FROM Toss_Decision WHERE Toss_Name = 'Bat') AND Toss_Winner = Match_Winner;"
    },
    {
        "input": "Find the city which has hosted the most number of matches.",
        "query": "SELECT City.City_Name, COUNT(Match.Match_Id) as Total_Matches FROM City INNER JOIN Venue ON City.City_Id = Venue.City_Id INNER JOIN Match ON Venue.Venue_Id = Match.Venue_Id GROUP BY City.City_Name ORDER BY Total_Matches DESC LIMIT 1;"
    },
    {
        "input": "Identify players who have both 'Right-hand bat' batting style and 'Right-arm fast' bowling skill.",
        "query": "SELECT Player.Player_Name FROM Player INNER JOIN Batting_Style ON Player.Batting_hand = Batting_Style.Batting_Id INNER JOIN Bowling_Style ON Player.Bowling_skill = Bowling_Style.Bowling_Id WHERE Batting_Style.Batting_hand = 'Right-hand bat' AND Bowling_Style.Bowling_skill = 'Right-arm fast';"
    },
    {
        "input": "Find the player with the highest strike rate in a season.",
        "query": "SELECT Player.Player_Name, (SUM(Batsman_Scored.Runs_Scored) * 100.0 / COUNT(*)) as Strike_Rate FROM Player INNER JOIN Player_Match ON Player.Player_Id = Player_Match.Player_Id INNER JOIN Batsman_Scored ON Player_Match.Match_Id = Batsman_Scored.Match_Id AND Player.Player_Id = Player_Match.Player_Id WHERE Season_Id = 2022 GROUP BY Player.Player_Name ORDER BY Strike_Rate DESC LIMIT 1;"
    },
    {
        "input": "Find matches where the winning margin was the closest.",
        "query": "SELECT Match_Id, Win_Type, MIN(Win_Margin) as Closest_Win_Margin FROM Match WHERE Win_Margin IS NOT NULL GROUP BY Win_Type;"
    },
    {
        "input": "Find the total runs scored by 'Virat Kohli' against 'Mumbai Indians' across all matches.",
        "query": "SELECT SUM(Batsman_Scored.Runs_Scored) as Total_Runs FROM Batsman_Scored INNER JOIN Player_Match ON Batsman_Scored.Match_Id = Player_Match.Match_Id INNER JOIN Player ON Player_Match.Player_Id = Player.Player_Id INNER JOIN Match ON Batsman_Scored.Match_Id = Match.Match_Id WHERE Player.Player_Name = 'Virat Kohli' AND (Match.Team_1 = (SELECT Team_Id FROM Team WHERE Team_Name = 'Mumbai Indians') OR Match.Team_2 = (SELECT Team_Id FROM Team WHERE Team_Name = 'Mumbai Indians'));"
    },
    {
        "input": "Find players who have both batted and bowled in at least 50 matches.",
        "query": "SELECT Player.Player_Name FROM Player INNER JOIN Player_Match ON Player.Player_Id = Player_Match.Player_Id GROUP BY Player.Player_Name HAVING COUNT(DISTINCT Player_Match.Match_Id) >= 50;"
    },
    {
        "input": "Find matches where a player scored a century and took at least 4 wickets.",
        "query": "SELECT Match.Match_Id FROM Match INNER JOIN Player_Match ON Match.Match_Id = Player_Match.Match_Id INNER JOIN Batsman_Scored ON Player_Match.Match_Id = Batsman_Scored.Match_Id INNER JOIN Wicket_Taken ON Player_Match.Match_Id = Wicket_Taken.Match_Id WHERE Batsman_Scored.Runs_Scored >= 100 AND Wicket_Taken.Player_Out = Player_Match.Player_Id GROUP BY Match.Match_Id HAVING COUNT(Wicket_Taken.Player_Out) >= 4;"
    },
    {
        "input": "Find the highest partnership for each team in each match.",
        "query": "SELECT Match_Id, Team_Batting, MAX(Runs_Scored) as Highest_Partnership FROM (SELECT Match_Id, Team_Batting, SUM(Runs_Scored) as Runs_Scored FROM Ball_by_Ball GROUP BY Match_Id, Team_Batting, Striker, Non_Striker) GROUP BY Match_Id, Team_Batting;"
    },
    {
        "input": "Find the player with the most 'Man of the Series' awards.",
        "query": "SELECT Player.Player_Name, COUNT(*) as Awards FROM Player INNER JOIN Season ON Player.Player_Id = Season.Man_of_the_Series GROUP BY Player.Player_Name ORDER BY Awards DESC LIMIT 1;"
    },
    {
        "input": "Find players who have been part of a match-winning team at least 10 times.",
        "query": "SELECT Player.Player_Name FROM Player INNER JOIN Player_Match ON Player.Player_Id = Player_Match.Player_Id INNER JOIN Match ON Player_Match.Match_Id = Match.Match_Id WHERE Player_Match.Team_Id = Match.Match_Winner GROUP BY Player.Player_Name HAVING COUNT(*) >= 10;"
    },
    {
        "input": "Find the player with the most ducks in their career.",
        "query": "SELECT Player.Player_Name, COUNT(*) as Ducks FROM Player INNER JOIN Player_Match ON Player.Player_Id = Player_Match.Player_Id INNER JOIN Batsman_Scored ON Player_Match.Match_Id = Batsman_Scored.Match_Id WHERE Batsman_Scored.Runs_Scored = 0 GROUP BY Player.Player_Name ORDER BY Ducks DESC LIMIT 1;"
    },
    {
        "input": "Find the matches with the highest aggregate score.",
        "query": "SELECT Match_Id, SUM(Runs_Scored) as Total_Runs FROM Batsman_Scored GROUP BY Match_Id ORDER BY Total_Runs DESC LIMIT 10;"
    }
]

system_prefix = """
You are an agent designed to interact with a SQL database.
Given an input question, create a syntactically correct {dialect} query to run, then look at the results of the query and return the answer.
Unless the user specifies a specific number of examples they wish to obtain, always limit your query to at most {top_k} results.
Give the results in name rather than ID form, unless the question specifically asks for IDs.
Use the most human-readable form of the data and output in using Markdown formatting. And display tables along with the summary text whenever possible for better readability.
You can order the results by a relevant column to return the most interesting examples in the database.
Never query for all the columns from a specific table, only ask for the relevant columns given the question.
You have access to tools for interacting with the database.
Only use the given tools. Only use the information returned by the tools to construct your final answer.
You MUST double check your query before executing it. If you get an error while executing a query, rewrite the query and try again.

DO NOT make any DML statements (INSERT, UPDATE, DELETE, DROP etc.) to the database.

If you need to filter on a proper noun, you must ALWAYS first look up the filter value using the "search_proper_nouns" tool!

Only use the following tables:
%s

Here are some examples of user inputs and their corresponding SQL queries:

"""%table_info

vector_db = FAISS.from_texts(batting_hand + bowling_skill + city_name + team_name + venue_name + country_name + extra_type + out_type + outcome_type + player_name, OpenAIEmbeddings(api_key=OPENAI_API_KEY))
retriever = vector_db.as_retriever(search_kwargs={"k": 5})
description = """Use to look up values to filter on. Input is an approximate spelling of the proper noun, output is \
valid proper nouns. Use the noun most similar to the search."""
retriever_tool = create_retriever_tool(
    retriever,
    name="search_proper_nouns",
    description=description,
)

example_selector = SemanticSimilarityExampleSelector.from_examples(
    examples,
    OpenAIEmbeddings(api_key=OPENAI_API_KEY),
    FAISS,
    k=5,
    input_keys=["input"],
)

few_shot_prompt = FewShotPromptTemplate(
    example_selector=example_selector,
    example_prompt=PromptTemplate.from_template(
        "User input: {input}\nSQL query: {query}"
    ),
    input_variables=["input", "dialect", "top_k"],
    prefix=system_prefix,
    suffix="",
)

full_prompt = ChatPromptTemplate.from_messages(
    [
        SystemMessagePromptTemplate(prompt=few_shot_prompt),
        ("human", "{input}"),
        MessagesPlaceholder("agent_scratchpad"),
    ]
)

agent = create_sql_agent(
    llm=llm,
    db=db,
    extra_tools=[retriever_tool],
    prompt=full_prompt,
    verbose=True,
    agent_type="openai-tools",
)

@app.route('/chat', methods=['GET'])
def chat():
    message = request.args.get('message', '')
    if message:
        handler = SQLHandler()
        response = agent.invoke({"input": str(message)}, {"callbacks": [handler]})['output']
        return jsonify({"message": response, "sql": handler.sql_result})
    return jsonify({"message": "No message provided"})

if __name__ == '__main__':
    app.run()