message=$1
cd /var/www/data/answer/
#echo ${message}
#git log --since=${message} --pretty=format:"%ad,%s"
git log --since=${message} --pretty=format:"%ad,%s" >/var/www/zyni/log/gitlab_answer_gitlog.log
