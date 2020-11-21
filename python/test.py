import mysql.connector
import json
from mysql.connector import Error

def read_DB():
    try:
        connection = mysql.connector.connect(host='localhost', database='mydb', user='admin', password='Juanse&960604')

        sql_select_Query = "select * from students"
        cursor = connection.cursor()
        cursor.execute(sql_select_Query)
        records = cursor.fetchall()

        names = []
        scores = []
        for row in records:
            names.append(row[1])
            scores.append(row[3])
        base = {'names':names, 'scores':scores}
        data = json.dumps(base)
        return data
    except Error as e:
        return e
    finally:
        if(connection.is_connected()):
            connection.close()
            cursor.close()
            #print("MySQL connection is closed")

if __name__ == '__main__':
    print(read_DB())
    