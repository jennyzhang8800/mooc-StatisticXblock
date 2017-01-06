from config import Config

class StatisticNew():
    conf=Config()
    logger = conf.getLog()

    def statistic(self):
        self.logger.info("test")

if __name__ == '__main__':
    sta=StatisticNew()
    sta.logger.info('test')

    
    
