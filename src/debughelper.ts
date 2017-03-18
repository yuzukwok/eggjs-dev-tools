import { ExtensionContext, languages, workspace, commands, Uri } from 'vscode';
import { connect } from 'net'
import { exec } from 'child_process'
export function debug(port: Number) {
    let opt = {
        "name": "attach port" + String(port) + " by api",
        "type": "node2",
        "request": "attach",
        "port": String(port)
    }
    commands.executeCommand('vscode.startDebug', opt).then(function (res) {
        console.log('debug inspect in ' + port)
    }, function (err) {
        console.log(err)
    })
}

export function findAllNodePid() {
    return new Promise<string[]>((resolve, reject) => {
        var cmd = process.platform === 'win32' ? 'tasklist ' : 'ps aux'
        exec(cmd, function (err, stdout, stderr) {
            if (err) { return reject(err) }
            let re = stdout.split('\n').filter(function (line) {
                var p = line.trim().split(/\s+/)
                var pname = p[0]
                if (pname === 'node.exe') {
                    return true
                } else {
                    return false
                }
            })
            let pids = []
            re.forEach(function (e) { pids.push(e.split(/\s+/)[1]); })
            resolve(pids)

        })
    })
}

export function findInspectNodeInMac() {

    var cmd = "ps aux | grep 'inspect\=\d*'"
    exec(cmd, function (err, stdout, stderr) {
        if (err) { console.log(err) }
        let re = stdout.split('\n');
        for (var index = 0; index < re.length; index++) {
            var line = re[index];
            if (line != '') {
                let get = line.match(/inspect\=\d*/)[0]
                let port = Number(get.replace('inspect=', ''))
                if(port)debug(port)
            }

        }

    })
}

export function findDebugPortAndDebug(pids: string[], debugStartPort: Number) {
    return new Promise<string[]>((resolve, reject) => {
        var cmd = process.platform === 'win32' ? 'Netstat -p TCP -ano ' : 'ps aux'
        exec(cmd, function (err, stdout, stderr) {
            if (err) { return console.log(err) }
            let re = stdout.split('\n').filter(function (line) {
                var p = line.trim().split(/\s+/)
                // '  TCP    0.0.0.0:15672          0.0.0.0:0              LISTENING       7872\r'
                if (p.length === 5) {
                    var pstate = p[3]
                    let port = Number(p[1].split(':')[1])
                    let pid = p[4]
                    if (pstate === 'LISTENING' && port > debugStartPort && pids.indexOf(pid) != -1) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            })
            for (var index = 0; index < re.length; index++) {
                var port = Number(re[index].trim().split(/\s+/)[1].split(':')[1]);
                debug(port)
            }
        })
    })
}


