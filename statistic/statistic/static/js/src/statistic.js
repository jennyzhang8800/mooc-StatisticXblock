/* Javascript for StatisticXBlock. */
function StatisticXBlock(runtime, element) {


    function showResult(result){
      $('#tips').innerHTML=""
      $('#iframepage').hide();
      $('#iframepage').attr('src',$('#iframepage').attr('src'));
      $('#iframepage').show();
    }
    var handlerUrlStatistic = runtime.handlerUrl(element,'statistic_update');
    $(function ($) {
        /* Here's where you'd do things on page load. */
        $('#iframepage').hide();
        $('#tips').innerHTML = '正在更新统计结果';
        $.ajax({
            type:"POST",
            url:handlerUrlStatistic,
            data:JSON.stringify({"statistic":"yes"}),
            success:showResult
      });
    });
}
