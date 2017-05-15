/**
 * Created with PyCharm.
 * User: jennyzhang
 * Date: 16-3-11
 * Time: 下午4:46
 * To change this template use File | Settings | File Templates.
 */


$(document).ready(function () {
    //页面加载时显示练习题完成情况列表
    showTemplate();
});

//下一页
function next() {
    hideTable();

    currentRow = pageSize * page;
    maxRow = currentRow + pageSize;
    if (maxRow > numberRowsInTable) maxRow = numberRowsInTable;
    for (var i = currentRow; i < maxRow; i++) {
        theTable.rows[i].style.display = '';
    }
    page++;

    if (maxRow == numberRowsInTable) { nextText(); lastText(); }
    showPage();
    preLink();
    firstLink();
}

//上一页
function pre() {
    hideTable();
    page--;
    currentRow = pageSize * page;
    maxRow = currentRow - pageSize;
    if (currentRow > numberRowsInTable) currentRow = numberRowsInTable;
    for (var i = maxRow; i < currentRow; i++) {
        theTable.rows[i].style.display = '';
    }
    if (maxRow == 0) { preText(); firstText(); }
    showPage();
    nextLink();
    lastLink();
}

//第一页
function first() {
    hideTable();
    page = 1;
    for (var i = 0; i < pageSize; i++) {
        theTable.rows[i].style.display = '';
    }
    showPage();
    preText();
    nextLink();
    lastLink();
}


//最后一页
function last() {
    hideTable();
    page = pageCount();
    currentRow = pageSize * (page - 1);
    for (var i = currentRow; i < numberRowsInTable; i++) {
        theTable.rows[i].style.display = '';
    }
    showPage();
    preLink();
    nextText();
    firstLink();
}


function hideTable() {
    for (var i = 0; i < numberRowsInTable; i++) {
        theTable.rows[i].style.display = 'none';
    }
}


function showPage() {
    pageNum.innerHTML = page;
}


//总共页数
function pageCount() {
    var count = 0;
    if (numberRowsInTable % pageSize != 0) count = 1;
    return parseInt(numberRowsInTable / pageSize) + count;
}

//显示链接
function preLink() { spanPre.innerHTML = "<a href='javascript:pre();'>上一页</a>"; }
function preText() { spanPre.innerHTML = "上一页"; }

function nextLink() { spanNext.innerHTML = "<a href='javascript:next();'>下一页</a>"; }
function nextText() { spanNext.innerHTML = "下一页"; }

function firstLink() { spanFirst.innerHTML = "<a href='javascript:first();'>第一页</a>"; }
function firstText() { spanFirst.innerHTML = "第一页"; }

function lastLink() { spanLast.innerHTML = "<a href='javascript:last();'>最后一页</a>"; }
function lastText() { spanLast.innerHTML = "最后一页"; }

//隐藏表格
function hide() {
    for (var i = pageSize; i < numberRowsInTable; i++) {
        theTable.rows[i].style.display = 'none';
    }
    totalPage.innerHTML = pageCount();
    pageNum.innerHTML = '1';
    nextLink();
    lastLink();
}

/***
 * 点击表头，出现"▲"，"▼"图标，并进行表格排序
 * @param dataSource:表的数据源
 * @param colId: 列Id
 * @param tableId :表的id
 * @param iCol:第几列
 */

function sortAble(dataSource,colId,tableId, iCol) {

    var ascChar = "▲";
    var descChar = "▼";
    var table = document.getElementById(tableId);
    //排序标题加背景色,并把所有单元格的“升序、降序” 小图标都先清除掉

    for (var t = 0; t < table.tHead.rows[0].cells.length; t++) {
        var th = $(table.tHead.rows[0].cells[t]);
        var thText = th.html().replace(ascChar, "").replace(descChar, "");
        if (t == iCol) {
            th.css("background-color", "#ccc");
        }
        else {
            th.css("background-color", "#fff");
            th.html(thText);
        }

    }
    //给排序标题加“升序、降序” 小图标显示,并调用排序函数进行排序
    var th = $(table.tHead.rows[0].cells[iCol]);
    if (th.html().indexOf(ascChar) == -1 && th.html().indexOf(descChar) == -1) {
        th.html(th.html() + ascChar);
        //按colId列进行升序排序
        sortTable(dataSource,colId,tableId, iCol,"asc");

    }
    else if (th.html().indexOf(ascChar) != -1) {
        th.html(th.html().replace(ascChar, descChar));
        //按colId列进行降序排序
        sortTable(dataSource,colId,tableId, iCol,"desc");


    }
    else if (th.html().indexOf(descChar) != -1) {
        th.html(th.html().replace(descChar, ascChar));
        //按colId列进行升序排序
        sortTable(dataSource,colId,tableId, iCol,"asc");


    }

}


/***
 * 对表格进行排序
 * @param dataSource:表的数据源
 * @param colId：列Id（按该列进行排序）
 * @param tableId：表Id
 * @param iCol:第几列
 * @param way:排序方式（升序，降序）
 */
function sortTable(dataSource,colId,tableId, iCol,way){

    //注册索引+1的helper
    var handleHelper = Handlebars.registerHelper("addOne",function(index){
        //返回+1之后的结果
        return index+1;
    });
    //对json进行降序排序函数
    var desc = function(x,y)
    {
        return (x[colId] < y[colId]) ? 1 : -1
    }
   //对json进行升序排序函数
    var asc = function(x,y)
    {
        return (x[colId] > y[colId]) ? 1 : -1
    }

    //练习题完成情况统计表格
    if(tableId=="tableFirst"){
    //请求数据

            if(way=="desc"){data.children.sort(desc);}
            else if(way="asc"){data.children.sort(asc);}
          //  alert(JSON.stringify(data));
            //加载数据入表格模板中
            var source   = $("#table-template").html();
            var template = Handlebars.compile(source);
            $("#tableDiv").html(template(data));
            //重新更新排序图标（因为表格刷新后图标不会保留）
            var ascChar = "▲";
            var descChar = "▼";
            var table = document.getElementById(tableId);
            //排序标题加背景色,并把所有单元格的“升序、降序” 小图标都先清除掉

            for (var t = 0; t < table.tHead.rows[0].cells.length; t++) {
                var th = $(table.tHead.rows[0].cells[t]);
                var thText = th.html().replace(ascChar, "").replace(descChar, "");
                if (t == iCol) {
                    th.css("background-color", "#ccc");
                }
                else {
                    th.css("background-color", "#fff");
                    th.html(thText);
                }

            }
            //给排序标题加“升序、降序” 小图标显示,并调用排序函数进行排序
            var th = $(table.tHead.rows[0].cells[iCol]);
            if (way=="asc") {
                th.html(th.html() + ascChar);
            }
            else if(way=="desc"){
                th.html(th.html() + descChar);
            }

            //分页显示
            altRows('tableFirst');
            theTable = document.getElementById("table3");
            totalPage = document.getElementById("spanTotalPage");
            pageNum = document.getElementById("spanPageNum");
            spanPre = document.getElementById("spanPre");
            spanNext = document.getElementById("spanNext");
            spanFirst = document.getElementById("spanFirst");
            spanLast = document.getElementById("spanLast");

            numberRowsInTable = theTable.rows.length;
            pageSize = 40;
            page = 1;
            hide();




    }

    //某一道题的己提交用户表
    else if(tableId=="alternatecolor-user"){

                //对Json数据进行排序
                if(way=="desc"){user_list.children.sort(desc);}
                else if(way="asc"){user_list.children.sort(asc);}
                //alert(JSON.stringify(user_list));

                //加载数据入表格模板中
               var source   = $("#user-table-template").html();
                var template = Handlebars.compile(source);
               $("#tableDiv").html(template(user_list));
               CurrentqNumber = document.getElementById("qNumber");
               CurrentqNumber.innerHTML = "(题号:"+user_list.q_number+")";
               var userCount= document.getElementById("userCount");
               userCount.innerHTML="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp本题共有<span style='color:red'>"+user_list["children"].length+"</span>个用户提交"
               altRows('alternatecolor-user');

                //重新更新排序图标（因为表格刷新后图标不会保留）
                var ascChar = "▲";
                var descChar = "▼";
                var table = document.getElementById(tableId);
                //排序标题加背景色,并把所有单元格的“升序、降序” 小图标都先清除掉

                for (var t = 0; t < table.tHead.rows[0].cells.length; t++) {
                    var th = $(table.tHead.rows[0].cells[t]);
                    var thText = th.html().replace(ascChar, "").replace(descChar, "");
                    if (t == iCol) {
                        th.css("background-color", "#ccc");
                    }
                    else {
                        th.css("background-color", "#fff");
                        th.html(thText);
                    }

                }
                //给排序标题加“升序、降序” 小图标显示,并调用排序函数进行排序
                var th = $(table.tHead.rows[0].cells[iCol]);
                if (way=="asc") {
                    th.html(th.html() + ascChar);
                }
                else if(way=="desc"){
                    th.html(th.html() + descChar);
                }

                //分页显示
                altRows('tableFirst');
                theTable = document.getElementById("table3");
                totalPage = document.getElementById("spanTotalPage");
                pageNum = document.getElementById("spanPageNum");
                spanPre = document.getElementById("spanPre");
                spanNext = document.getElementById("spanNext");
                spanFirst = document.getElementById("spanFirst");
                spanLast = document.getElementById("spanLast");

                numberRowsInTable = theTable.rows.length;
                pageSize = 40;
                page = 1;
                hide();

    }

    //某一用户的完成情况表格
    else if(tableId=="alternatecolor-user-qnumber"){

        //对Json数据进行排序
        if(way=="desc"){qListByName.qNumberList.sort(desc);}
        else if(way="asc"){qListByName.qNumberList.sort(asc);}

        //注册索引+1的helper
        var handleHelper = Handlebars.registerHelper("addOne",function(index){
            //返回+1之后的结果
            return index+1;
        });
        var source   = $("#user-qnumber-table-template").html();
        var template = Handlebars.compile(source);
        $("#tableDiv").html(template(qListByName));
        CurrentqNumber = document.getElementById("userName");
        CurrentqNumber.innerHTML = "(用户:"+qListByName.email+")";
        var exerciseCount= document.getElementById("exerciseCount");
        exerciseCount.innerHTML="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp该用户提交了<span style='color:red'>"+qListByName.qNumberList.length+"</span>道题";

        //重新更新排序图标（因为表格刷新后图标不会保留）
        var ascChar = "▲";
        var descChar = "▼";
        var table = document.getElementById(tableId);
        //排序标题加背景色,并把所有单元格的“升序、降序” 小图标都先清除掉

        for (var t = 0; t < table.tHead.rows[0].cells.length; t++) {
            var th = $(table.tHead.rows[0].cells[t]);
            var thText = th.html().replace(ascChar, "").replace(descChar, "");
            if (t == iCol) {
                th.css("background-color", "#ccc");
            }
            else {
                th.css("background-color", "#fff");
                th.html(thText);
            }

        }
        //给排序标题加“升序、降序” 小图标显示,并调用排序函数进行排序
        var th = $(table.tHead.rows[0].cells[iCol]);
        if (way=="asc") {
            th.html(th.html() + ascChar);
        }
        else if(way=="desc"){
            th.html(th.html() + descChar);
        }
        altRows('alternatecolor-user-qnumber');
        theTable = document.getElementById("table5");
        totalPage = document.getElementById("spanTotalPage");
        pageNum = document.getElementById("spanPageNum");
        spanPre = document.getElementById("spanPre");
        spanNext = document.getElementById("spanNext");
        spanFirst = document.getElementById("spanFirst");
        spanLast = document.getElementById("spanLast");

        numberRowsInTable = theTable.rows.length;
        pageSize = 40;
        page = 1;
        hide();
    }
}




 //显示课程的所有练习题完成情况
 function showTemplate(){

 //注册索引+1的helper
 var handleHelper = Handlebars.registerHelper("addOne",function(index){
 //返回+1之后的结果
 return index+1;
 });
 $.ajax({
 type : "get",
 cache : false,
 url :"./statisticByQnumber_result.json" , // 请求地址
 success : function(data_i) { // ajax执行成功后执行的方法

    data=data_i;
// data = eval("(" + data_i + ")") // 把string转化为json

 var source   = $("#table-template").html();
 var template = Handlebars.compile(source);
 $("#tableDiv").html(template(data));
 altRows('tableFirst');
 //分页显示
 theTable = document.getElementById("table3");
 totalPage = document.getElementById("spanTotalPage");
 pageNum = document.getElementById("spanPageNum");

 spanPre = document.getElementById("spanPre");
 spanNext = document.getElementById("spanNext");
 spanFirst = document.getElementById("spanFirst");
 spanLast = document.getElementById("spanLast");

 numberRowsInTable = theTable.rows.length;
 pageSize = 40;
 page = 1;
 hide();


 }
 });



 }



//根据题号，显示提交的该题的所有用户
function ShowUsers(qNumber){

    showTemplateUser(qNumber);
    //分页显示
    theTable = document.getElementById("table4");
    totalPage = document.getElementById("spanTotalPage");
    pageNum = document.getElementById("spanPageNum");

    spanPre = document.getElementById("spanPre");
    spanNext = document.getElementById("spanNext");
    spanFirst = document.getElementById("spanFirst");
    spanLast = document.getElementById("spanLast");

    numberRowsInTable = theTable.rows.length;
    pageSize = 40;
    page = 1;
    hide();


}



//根据题号，显示提交了该题的所有用户
function showTemplateUser(qNumber){
    //注册索引+1的helper
    var handleHelper = Handlebars.registerHelper("addOne",function(index){
        //返回+1之后的结果
        return index+1;
    });


    var source   = $("#user-table-template").html();
    var template = Handlebars.compile(source);


    user_list={};
    user_list["q_number"]=qNumber;
    user_list["children"]=[]

    for(var i=0; i<data.children.length;i++){
        if(data.children[i].q_number==qNumber){user_list["children"]=data.children[i].email_list;break;}

    }

    $("#tableDiv").html(template(user_list));
    CurrentqNumber = document.getElementById("qNumber");
    CurrentqNumber.innerHTML = "(题号:"+qNumber+")";
    var userCount= document.getElementById("userCount");
    userCount.innerHTML="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp本题共有<span style='color:red'>"+user_list["children"].length+"</span>个用户提交"
    altRows('alternatecolor-user');

}


//根据用户名，显示该用户所提交的题
function ShowQNumberList(userName){
     $.ajax({
        type:"get",
        url:"./statisticByEmail_result.json",
        success:function(data_e){
           // data_email = eval("(" + data_e + ")") // 把string转化为json
            data_email=data_e;
            qListByName={};
            var qNumberList=[];
            qListByName["email"]=userName;
            for(var i=0; i<data_email.length;i++){

                if(data_email[i]["email"]==userName){
                    qNumberList.push(data_email[i]);
                }}
            qListByName["qNumberList"]=qNumberList;
            //alert(JSON.stringify(qListByName));
            //注册索引+1的helper
            var handleHelper = Handlebars.registerHelper("addOne",function(index){
                //返回+1之后的结果
                return index+1;
            });
            var source   = $("#user-qnumber-table-template").html();
            var template = Handlebars.compile(source);
            $("#tableDiv").html(template(qListByName));
            CurrentqNumber = document.getElementById("userName");
            CurrentqNumber.innerHTML = "(用户:"+userName+")";
            var exerciseCount= document.getElementById("exerciseCount");
            exerciseCount.innerHTML="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp该用户提交了<span style='color:red'>"+qNumberList.length+"</span>道题";

            altRows('alternatecolor-user-qnumber');
            theTable = document.getElementById("table5");
            totalPage = document.getElementById("spanTotalPage");
            pageNum = document.getElementById("spanPageNum");
            spanPre = document.getElementById("spanPre");
            spanNext = document.getElementById("spanNext");
            spanFirst = document.getElementById("spanFirst");
            spanLast = document.getElementById("spanLast");

            numberRowsInTable = theTable.rows.length;
            pageSize = 40;
            page = 1;
            hide();
        }
    })
}

//显示某个题号用应的未批改用户列表
function ShowUnGradedDetail(qNumber){
  
    //注册索引+1的helper
    var handleHelper = Handlebars.registerHelper("addOne",function(index){
 //返回+1之后的结果
 return index+1;
    });


    var source   = $("#un-graded-table-template").html();
    var template = Handlebars.compile(source);


    user_list={};
    user_list["q_number"]=qNumber;
    user_list["children"]=[];

    for(var i=0; i<data.children.length;i++){
       if(data.children[i].q_number==qNumber){

           for(var j=0;j<data.children[i].email_list.length;j++){
                    if(data.children[i].email_list[j].graded=="false"){
                         user_list["children"].push(data.children[i].email_list[j]);
         }
 }

}

 }

 $("#tableDiv").html(template(user_list));
 CurrentqNumber = document.getElementById("qNumber");
 CurrentqNumber.innerHTML = "(题号:"+qNumber+")";
 var userCount= document.getElementById("userCount");
 userCount.innerHTML="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp本题共有<span style='color:red'>"+user_list["children"].length+"</span>个用户提交"
 altRows('alternatecolor-user');



}




//跳转到批改xblock
function ToGrade(LinkObj){
var email=LinkObj.id;
var qNumber=LinkObj.name;
var url="http://cherry.cs.tsinghua.edu.cn/courses/Tsinghua/CS101/2015_T1/courseware/65a2e6de0e7f4ec8a261df82683a2fc3/8891ccda525942a19f7897d849a21606/"+"?email="+email+",qno="+qNumber;
window.open(url);


}











//表格样式，自动隔行换色
function altRows(id){
    if(document.getElementsByTagName){

        var table = document.getElementById(id);
        var rows = table.getElementsByTagName("tr");

        for(i = 0; i < rows.length; i++){
            if(i % 2 == 0){
                rows[i].className = "evenrowcolor";
            }else{
                rows[i].className = "oddrowcolor";
            }
        }
    }
}

