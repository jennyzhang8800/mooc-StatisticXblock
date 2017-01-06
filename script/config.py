# -*- coding: utf-8 -*-
__author__ = 'jennyzhang'
import logging
class Config():
    logName = 'statistic'
    logFile = '/var/www/zyni/log/statistic.log'
    gitRepoPath = '/var/www/data/answer'
    ByEmailResultPath = '/edx/var/edxapp/staticfiles/statistic/statisticByEmail_result.json'
    ByQnumberResultPath = '/edx/var/edxapp/staticfiles/statistic/statisticByQnumber_result.json'
    statisticTimeLog = '/var/www/zyni/log/statisticTime.log'
    # ����һ��logger
    logger = logging.getLogger(logName)
    logger.setLevel(logging.DEBUG)

    # ����һ��handler������д����־�ļ�
    fh = logging.FileHandler(logFile)
    fh.setLevel(logging.DEBUG)

    # �ٴ���һ��handler���������������̨
    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)

    # ����handler�������ʽ
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    fh.setFormatter(formatter)
    ch.setFormatter(formatter)

    # ��logger���handler
    logger.addHandler(fh)
    logger.addHandler(ch)
    def getLog(self):
        return self.logger


