__author__ = 'zhangyanni'
import codecs
import json
import os
import time
from config import Config
ISOTIMEFORMAT='%Y-%m-%d'
FORMAT2='%Y-%m-%d %H:%M'
conf = Config()
logger = conf.getLog()
def statisticAllByQnumber(path):
    fileObj=readFile(path)
    jsonDict=json.load(fileObj)
    result={}
    result["children"]=[]
    qnumberList=[]


    qnumberCount=""
    for item in jsonDict:
        if(item["q_number"] not in qnumberList):
            qnumberList.append(item["q_number"])
            newOne={}
            newOne["q_number"]=item["q_number"]
            newOne["latest_commit"]=item["commit_time"]
            newOne["email_list"]=[]
            temp={}
            temp["email"]=item["email"]
            temp["commit_time"]=item["commit_time"]
            temp["grade"]=item["grade"]
            temp["graded"]=item["graded"]
            newOne["email_list"].append(temp)
            newOne["email_count"]=1
            if(temp["graded"]=="false"):
                newOne["un_graded_count"]=1
            else:
                newOne["un_graded_count"]=0
            result["children"].append(newOne)

        else:
            for item_q in result["children"]:
                if(item_q["q_number"]==item["q_number"]):
                    temp={}
                    temp["email"]=item["email"]
                    temp["commit_time"]=item["commit_time"]
                    temp["grade"]=item["grade"]
                    temp["graded"]=item["graded"]
                    item_q["email_list"].append(temp)
                    item_q["email_count"]=len(item_q["email_list"])
                    if(item_q["latest_commit"]<item["commit_time"]):
                        item_q["latest_commit"]=item["commit_time"]
                    if(item["graded"]=="false"):
                        item_q["un_graded_count"]=item_q["un_graded_count"]+1
    result["q_number_count"]=len(qnumberList)
    data=json.dumps(result,sort_keys=True,indent=4)
    #print data
    return data

def readFile(path):
    try:
        fileObj=codecs.open(path,encoding='utf-8')
    except Exception as e:
        logger.exception('ERROR readFile:%s,%s' % (path,str(e)))
    return fileObj

def saveFile(file_path,data):
    try:
        output = codecs.open(file_path,'w',"utf-8")
        output.write(data)
        output.close()
    except Exception as e:
        logger.exception('ERROR saveFile:%s,%s' % (path,str(e)))
if __name__ == '__main__':
    try:
        data=statisticAllByQnumber(conf.ByEmailResultPath) 
    except Exception as e:
        logger.exception('ERROR %s' % (str(e)))
    saveFile(conf.ByQnumberResultPath,data)
    statistic_time=time.strftime(ISOTIMEFORMAT,time.localtime())
    saveFile(conf.statisticTimeLog,statistic_time)
    time2=time.strftime(FORMAT2,time.localtime())
    print str(time2)+"   Statistic finished! Please see the log file to check:/var/www/zyni/log/statistc.log"
