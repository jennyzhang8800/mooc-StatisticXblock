# coding:utf-8
"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources
import os
from xblock.core import XBlock
from xblock.fields import Scope, Integer,String
from xblock.fragment import Fragment


class StatisticXBlock(XBlock):
    """
    TO-DO: document what your XBlock does.
    """

    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.

    # TO-DO: delete count, and define your own fields.
    count = Integer(
        default=0, scope=Scope.user_state,
        help="A simple counter, to show something happening",
    )
    display_name = String(display_name='statistic',default='练习题统计',scope=Scope.settings,help='Name of statistic xblock in studio')

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the StatisticXBlock, shown to students
        when viewing courses.
        """
        html = self.resource_string("static/html/statistic.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/statistic.css"))
        frag.add_javascript(self.resource_string("static/js/src/statistic.js"))
        frag.initialize_js('StatisticXBlock')
        return frag

    # TO-DO: change this handler to perform your own actions.  You may need more
    # than one handler, or you may not need any handlers at all.
    @XBlock.json_handler
    def statistic_update(self, data, suffix=''):
        """
        An  handler, which statistic new added exercise today.
        """
        
        try:
            os.system('/var/www/zyni/script/pullFromGitlab.sh')
            os.system('python /var/www/zyni/script/statisticNewAdded.py')
        except Exception as e:
            return {'status':str(e)}
        return {"status":"success"}

    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("StatisticXBlock",
             """<statistic/>
             """),
            ("Multiple StatisticXBlock",
             """<vertical_demo>
                <statistic/>
                <statistic/>
                <statistic/>
                </vertical_demo>
             """),
        ]
