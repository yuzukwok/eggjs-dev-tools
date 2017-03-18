# Egg.js Dev Tools
Visual Studio Code plugin for Egg.js

## Installation
In the command palette (cmd-shift-p) select Install Extension and choose Egg.js dev tools


## Contributing
Something missing? Found a bug? - Create a pull request or an issue.
[Github](https://github.com/yuzukwok/eggjs-dev-tools)

## History
### v0.4.0
    支持自动附加到调试进程，优化egg调试体验（实验,待egg 或vscode优化后会移除） 
    先在集成控制台中使用npm run dev -- --inspect 开启调试后 
    命令面板 选择“egg自动附加调试进程(实验)”（默认快捷建为ctrl+1/ cmd+1） vscode 将自动附加一个node调试进程，规则如下  
    mac： 以--inspect= 启动的进程  
    windows：以调试端口>9230的调试进程  
### v0.3.0
   支持 ctx.service 类元素的智能感应
### v0.2.0
   支持 app.config 智能感应（基于应用run目录下的json信息提供）
### v0.1.0
- Initial 
   支持ctx.service 和app.model 的自动完成感应  
   新增 egg 的controller service 代码  


## License
This software is released under [MIT License](http://www.opensource.org/licenses/mit-license.php)
