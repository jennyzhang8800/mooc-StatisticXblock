# mooc-StatisticXblock
练习题完成情况统计XBlock。布署于edX（IP:192.168.1.135, http://cherry.cs.tsinghua.edu.cn）

## 1. 安装Xblock
1. clone到edx本地服务器
2. 安装xblock

## 2. 静态文件安装

在文件夹/edx/var/edxapp/staticfiles/下新建文件夹statistic/，并将```mooc-StatisticXblock/statistic```下的文件复制到```/edx/var/edxapp/staticfiles/statistic/```，同时增加所有人对其的读权限

```
$ sudo mkdir -p /edx/var/edxapp/staticfiles/statistic
$ sudo cp -r mooc-StatisticXblock/statistic/* /edx/var/edxapp/staticfiles/statistic/
$ sudo chmod a+r -R /edx/var/edxapp/staticfiles/statistic/
```

## 3. 脚本安装
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

   可以先运行一遍脚本，查看日志，如果脚本运行正常，则可以设定脚本的定时执行。
   
   
