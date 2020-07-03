"use strict";

var setting = {
    "workbench.sideBar.location": "left",
    "editor.fontSize": 18,
    // "editor.formatOnSave": true, //每次保存自动格式化
    "editor.formatOnType": true,
    "editor.snippetSuggestions": "top",
    // Controls whether format on paste is on or off
    "editor.formatOnPaste": true,
    "window.zoomLevel": 1,
    "atomKeymap.promptV3Features": true,
    "vetur.format.defaultFormatter.html": "js-beautify-html",
    "files.associations": {
        "*.vue": "vue"
    },
    "editor.multiCursorModifier": "ctrlCmd",
    "workbench.iconTheme": "vscode-icons",
    "files.autoSave": "off",
    "editor.detectIndentation": false, //缩进
    "vetur.validation.template": false, //遍历时报错
    "editor.wordWrap": "on", //换行
    "terminal.integrated.shell.windows": "C:\\WINDOWS\\System32\\cmd.exe",
    "team.showWelcomeMessage": false, //scss报错
    "emmet.syntaxProfiles": {
        "vue-html": "html",
        "vue": "html"
    },
    "emmet.triggerExpansionOnTab": true,
    "eslint.autoFixOnSave": true,
    "eslint.validate": ["javascript", "javascriptreact", {
        "language": "html",
        "autoFix": true
    }, {
        "language": "vue",
        "autoFix": true
    }, "html", "vue"],
    "prettier.singleQuote": true,
    "prettier.semi": true,
    // "vetur.format.defaultFormatterOptions": {
    //     "wrap_attributes": "force-aligned"
    // },
    "C_Cpp.clang_format_style": "{ BasedOnStyle: Chromium, IndentWidth: 4}",
    //这是大括号后不换行
    "beautify.config": {
        "brace_style": "collapse,preserve-inline"
    },
    "workbench.colorTheme": "Atom One Dark",
    // Set backgroundColor
    "highlight-icemode.backgroundColor": "red",
    // Set Border Color
    "highlight-icemode.borderColor": "blue",
    "vetur.format.defaultFormatter.js": "vscode-typescript",
    "vetur.format.defaultFormatterOptions": {
        "js-beautify-html": {
            "wrap_attributes": "force" // 可以换成上面任意一种value
        }
    }
};