__author__ = 'zhangyanni'

# -*- coding:utf-8 -*-
import codecs
import json
import os
import time
from config import Config
ISOTIMEFORMAT='%Y-%m-%d'
conf = Config()
logger = conf.getLog()
def statisticNewAdded(path_log,path):
    fileObj=readFile(path_log)
    commitNewAdded=[]
    for line in fileObj:
        commitMe=line.split(',')[-1]
        if(commitMe.split(' ')[0]=='create'):
            cur_path=commitMe.split(' ')[-1].strip()
            q_number=cur_path.split('/')[-2]
            
            filePath=os.path.join(conf.gitRepoPath,cur_path)
            data=readFile(filePath).read()
            data_dict=json.loads(data)
            email=data_dict["student"]["email"]
            commit_time=data_dict["answer"][0]["time"]
            if data_dict["answer"][0]["answer"]==data_dict["question"]["answer"]:
                grade="true"
            else:
                grade="false"
            (parent_dir,file_name)=os.path.splitext(cur_path)
            parent_dir_all=os.path.join(conf.gitRepoPath,parent_dir)
            if(os.path.exists(os.path.join(parent_dir_all,str(q_number)+".graded.json"))):
                graded="true"
            else:
                graded="false"
            obj={}
            obj["q_number"]=str(q_number)
            obj["email"]=email
            obj["commit_time"]=commit_time
            obj["grade"]=grade
            obj["graded"]=graded

            commitNewAdded.append(obj)
#    print json.dumps(commitNewAdded)
    if commitNewAdded:
        data_old=readFile(path).read()
        data_old_dict=json.loads(data_old)
        for item in commitNewAdded:
            q_number=item["q_number"]
            email=item["email"]
            num=0
            for obj in data_old_dict:
                if(int(obj["q_number"]) == int(q_number)) and (email == obj["email"]):
                    break
                else:
                    num=num+1
            if num==0:
                data_old_dict.append(item)
        return data_old_dict
    else:
        return 0
   
            
  
   
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
    logger.info("Statistic Xblock invoke")
    path_log=r"/var/www/zyni/log/gitlab_answer_gitlog.log"
    data=readFile(conf.statisticTimeLog)
    statisticTime=[]
    for line in data:
        statisticTime.append(line.strip())
    last_statistic_time=statisticTime[-1]
    logger.info("lastest statistic time is:"+last_statistic_time)
    os.system('/var/www/zyni/script/statistic_new_commit.sh '+last_statistic_time)
    log=readFile(path_log).read()
    if len(log) != 0:
        logger.info("there are new commit")
        logger.info("statisticNewAdded function invoke")
        data=statisticNewAdded(conf.gitlabCommitLog,path)
        if data is not 0:
            data=json.dumps(data)
            saveFile(conf.ByEmailResultPath,data)
            logger.info("Save file statisticByEmail_result.json")
           
            os.system('python /var/www/zyni/script/statisticAllByQnumber.py')   
            logger.info("statisticAllByQnumber.py invoke")
    else:
        logger.info("There is no new commit")





