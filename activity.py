#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Lionel Laské 


from gi.repository import Gtk
import logging
import os

from gettext import gettext as _

from sugar3.activity import activity
from sugar3.graphics.toolbarbox import ToolbarBox
from sugar3.graphics.toolbutton import ToolButton
from sugar3.activity.widgets import ActivityButton
from sugar3.activity.widgets import TitleEntry
from sugar3.activity.widgets import StopButton
from sugar3.activity.widgets import ShareButton
from sugar3.activity.widgets import DescriptionItem
from sugar3.presence import presenceservice

from gi.repository import WebKit
import logging
import gconf

from datetime import date

from enyo import Enyo

from l10n import _fc_l10n


# Init log
_logger = logging.getLogger('roots-activity')
_logger.setLevel(logging.DEBUG)
_consolehandler = logging.StreamHandler()
_consolehandler.setLevel(logging.DEBUG)
_consolehandler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
_logger.addHandler(_consolehandler)


# Main class for the activity
class FoodChainActivity(activity.Activity):
    "Main class for the activity"

    def __init__(self, handle):
        """Set up the activity."""
        self.context = {}
        self.showconsole = False
        activity.Activity.__init__(self, handle)

        self.max_participants = 1

        self.make_toolbar()
        self.make_mainview()

    def alert(self, msg):
        """Display a message dialog"""
        messagedialog = Gtk.MessageDialog(self, type=1, buttons=1,  message_format=msg)
        messagedialog.run()
        messagedialog.destroy()

    def console_message(self, message):
        if not self.showconsole:
            return
        self.console.set_text(self.console.get_text(self.console.get_start_iter(), self.console.get_end_iter(), True)+message+"\n")
        self.consoleview.scroll_mark_onscreen(self.console.get_insert())

    def init_context(self, args):
        "Init Javascript context sending information about localization and saved game"
        self.enyo.send_message("localization", _fc_l10n)
        self.enyo.send_message("load-context", self.context)

    def make_mainview(self):
        "Create the activity view"
        # Create global box
        vbox = Gtk.VBox(False)

        # Create webview
        self.webview = webview = WebKit.WebView()

        # Create console for debug (set to True)
        self.showconsole = False
        if self.showconsole:
            swv = Gtk.ScrolledWindow()
            swv.add(webview)
            webview.show()
            vbox.pack_start(swv, True, True, 0)
            swv.set_size_request(800, 700)
            swv.show()

            sw = Gtk.ScrolledWindow()
            self.consoleview = textview = Gtk.TextView()
            self.console = console = textview.get_buffer()
            sw.add(textview)
            sw.show()
            textview.show()
            sw.set_size_request(800, 100)

            vbox.pack_end(sw, True, True, 0)
        else:
            webview.show()
            vbox.pack_start(webview, True, True, 0)
        vbox.show()

        # Activate Enyo interface
        self.enyo = Enyo(webview)
        self.enyo.connect("ready", self.init_context)
        self.enyo.connect("console-message", self.console_message)
        self.enyo.connect("save-context", self.save_context)

        # Go to first page
        web_app_page = os.path.join(activity.get_bundle_path(), "html/index.html")
        self.webview.load_uri('file://' + web_app_page)

        # Display all
        self.set_canvas(vbox)
        vbox.show()

    def make_toolbar(self):
        # toolbar with the new toolbar redesign
        toolbar_box = ToolbarBox()

        activity_button = ActivityButton(self)
        toolbar_box.toolbar.insert(activity_button, 0)
        activity_button.show()

        title_entry = TitleEntry(self)
        toolbar_box.toolbar.insert(title_entry, -1)
        title_entry.show()

        description_item = DescriptionItem(self)
        toolbar_box.toolbar.insert(description_item, -1)
        description_item.show()

        share_button = ShareButton(self)
        toolbar_box.toolbar.insert(share_button, -1)
        share_button.show()

        separator = Gtk.SeparatorToolItem()
        separator.props.draw = False
        separator.set_expand(True)
        toolbar_box.toolbar.insert(separator, -1)
        separator.show()

        stop_button = StopButton(self)
        toolbar_box.toolbar.insert(stop_button, -1)
        stop_button.show()

        self.set_toolbar_box(toolbar_box)
        toolbar_box.show()


    def write_file(self, file_path):
        "Called when activity is saved, get the current context in Enyo"
        self.file_path = file_path
        self.enyo.send_message("save-context")


    def save_context(self, context):
        "Called by Enyo to save the current context"
        file = open(self.file_path, 'w')
        try:
            file.write(str(context['score'])+'\n')
            file.write(context['game']+'\n')
            file.write(str(context['level'])+'\n')
        finally:
            file.close()


    def read_file(self, file_path):
        "Called when activity is loaded, load the current context in the file"
        file = open(file_path, 'r')
        self.context = {}
        try:
            self.context['score'] = file.readline().strip('\n')
            self.context['game'] = file.readline().strip('\n')
            self.context['level'] = file.readline().strip('\n')
        finally:
            file.close()

