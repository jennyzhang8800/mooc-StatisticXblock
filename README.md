# mooc-StatisticXblock
练习题完成情况统计XBlock。布署于edX（IP:192.168.1.135, http://cherry.cs.tsinghua.edu.cn）

Demo：[点击查看](http://cherry.cs.tsinghua.edu.cn/courses/Tsinghua/CS101/2015_T1/courseware/65a2e6de0e7f4ec8a261df82683a2fc3/31997002ffe3402388b8c9acaf4267d0/)

## 1. 安装Xblock （statistic）
   (1) clone到edx本地服务器,并将所有者设为edxapp

```
git clone https://github.com/jennyzhang8800/mooc-StatisticXblock.git
sudo chown -R edxapp:edxapp mooc-StatisticXblock/
```
   (2) 安装xblock
```
cd mooc-StatisticXblock/statistic
sudo -u edxapp /edx/bin/pip.edxapp install .

```
## 2. 静态文件安装 (staticfiles/statistic)

在文件夹/edx/var/edxapp/staticfiles/下新建文件夹statistic/，并将```mooc-StatisticXblock/statistic```下的文件复制到```/edx/var/edxapp/staticfiles/statistic/```，同时增加所有人对其的读权限

```
$ sudo mkdir -p /edx/var/edxapp/staticfiles/statistic
$ sudo cp -r mooc-StatisticXblock/staticfiles/statistic/* /edx/var/edxapp/staticfiles/statistic/
$ sudo chmod a+r -R /edx/var/edxapp/staticfiles/statistic/
```

## 3. 脚本安装 (script)
1. **建立edX与gitlab仓库的ssh连接**

 [参考链接](http://apple.cs.tsinghua.edu.cn/help/ssh/README)
 
 1.1 切换到www-data用户
 ```
 sudo -u www-data bash
 ```
 1.2 生成key pair
 
 ```
 ssh-keygen -t rsa -C "jennyzhang8800@163.com"
 ```
 上面的jennyzhang8800@163.com 改成你的邮箱
 
 1.3 复制生成的id_rsa.pub
 ```
 vi /var/www/.ssh/id_rsa.pub
 ```
 1.4 把id_rsa.pub的内容粘贴到gitlab的ssh key中，并添加该ssh key
 
 1.5 测试是否可以用ssh连接
 ```
 ssh -T git@192.168.1.136
 ```
 把上面的192.168.1.136换成你的gitlab的IP,一定要写IP，不能写域名
 
 如果出现```Welcome to Gitlab,teacher! ``` 则说明己建立ssh连接成功！
 
2. **把gitlab的answer仓库clone到edx服务器**

   切换到www-data用户，并在/var/www/目录下新建data文件夹，然后把 answer仓库clone到/var/www/data目录下
   
   ```
   sudo -u www-data bash
   cd /var/www/
   mkdir data
   cd data
   git clone git@192.168.1.136:teacher/answer.git
   ```
   
3. **把script下的脚本复制到/var/www/zyni/script/**

   新建目录/var/www/zyni/script/，把mooc-StatisticXblock/script下的脚本都复制过去,确保www-data对脚本有可执行权限
   ```
  
   mkdir /var/www/zyni/script
   mkdir /var/www/zyni/log
   cp mooc-StatisticXblock/script/* /var/www/zyni/script
   sudo chmod -R 777 /var/www/zyni/script
 
   ```
   
 
  
  
4. **检查脚本运行情况**

   可以先运行一遍脚本，查看日志，如果脚本运行正常，则可以设定脚本的定时执行。脚本的日志存放在 /var/www/zyni/log目录下。
   
   脚本及功能
   
| 脚本名 | 功能 |
|:----:| :----:|
|pullFromGitlab.sh|从gitlab把"answer"仓库pull到服务器的'/var/www/data'目录下|
|statisticByEmail.py|对所有己提交的题进行全面统计，记录邮箱，题号，提交时间，批改结果|
|statisticAllByQnumber.py|跟据statisticByEmail.py运行的结果，按题号进行全面的统计|
|statisticNewAdded.py|实现学生作业提交的增量统计|
|statistic_new_commit.sh|提取出指定时间之后的commit信息，只提取commit的时间和commit message这两项信息。|

执行流程：

+ 在Xblock加载时：调用脚本“statisticNewAdded.py”以增量的方式统计练习题完成情况。
  
 + 首先从gitlab仓库的git log信息中统计出从上一次全面统计（即当天凌晨）之后新增加的commit (通过statistic_new_commit.sh实现)，日志结果保存在/var/www/zyni/log/gitlab_answer_gitlog.log
  
 + 然后根据gitlab_answer_gitlog.log进行统计新增加的提交，并更新statisticByEmail_result.json和statisticAllByQnumber_result.json
 
![picture](https://github.com/jennyzhang8800/mooc-StatisticXblock/blob/master/%E5%A2%9E%E9%87%8F%E6%9B%B4%E6%96%B0.jpg)

+ 另外每天的00:02会执行三个脚本：pullFromGitlab.sh、statisticByEmail.py、statisticByEmail.py进行一次全面的统计。并记录下统计的时间到/var/www/zyni/log/statisticTime.log.作为增量统计的基准时间。统计的结果保存在```/edx/var/edxapp/staticfiles/statistic/```下的 statisticByEmail_result.json和statisticAllByQnumber_result.json。

![picture](https://github.com/jennyzhang8800/mooc-StatisticXblock/blob/master/%E5%AE%9A%E6%97%B6%E6%89%A7%E8%A1%8C.jpg)

   所有的日志信息保存在：```/var/www/zyni/log```目录下。
   
   edx系统日志可查看：```/edx/var/log/lms/edx.log``` 和``` /edx/var/log/cms/edx.log```
