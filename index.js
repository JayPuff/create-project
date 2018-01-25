#!/usr/bin/env node
const { exec, spawn } = require('child_process');
var program = require('commander');
var chalk = require('chalk');
var fs = require("fs-extra");
//var fs = require('fs');


// Globals
var name;
var env;
var research;
var path;


var workpath = "C:\\Users\\igotcha\\Desktop\\Projects";
var workpath_research = "C:\\Users\\igotcha\\Desktop\\Research";
var homepath = "C:\\Users\\igotcha\\Desktop\\Projects";

// Read arguments 
program
    .usage('[options] <project>')
    .arguments('<project>')
    .option('-h, --home', "I'm at home")
    .option('-r, --research', "It's research")
    .option('-w, --work', "I'm at work")
    .option('-t, --type <n>', 'which project type?')
    .action(function(project) {
        name = project;
        research = program.research;
        env = program.home ? "HOME" : program.home;
        env = program.work ? "WORK" : program.work;
        env = env || "WORK";
    })
.parse(process.argv);

// Check for project name!
if(typeof name === "undefined") {
    console.log(chalk.hex('#9e3952')('Please specify a project name!'));
    return;
}

// Set current path
if(env === "WORK") {
    if(research) {
        path = workpath_research;
    } else {
        path = workpath;
    }
} else {
    path = homepath;
}

// See to make sure project folder does not already exist in environment!
if (!fs.existsSync(path + "/" + name)) {
    fs.mkdirSync(path + "/" + name);
    console.log(chalk.hex('#bada55')('> Created project directory'));
} else {
    console.log(chalk.hex('#9e3952')('Folder already exists, Choose a different project name.'));
    return;
}


// exec('cd ' + path + "/" + name + ' && npm init -y', (err, stdout, stderr) => {
//     if (err) {
//         console.log('could not npm init, do you have npm installed?');
//         return;
//     }

//     console.log(chalk.hex('#bada55')('> Created package.json'));

//     getTemplate();
// }); 


getTemplate();


function getTemplate() {
    exec('cd ' + path + "/" + name + ' && git clone ' + ((program.type == 'webpack') ? 'https://ChocoMilkPlz@bitbucket.org/ChocoMilkPlz/webpack-project.git' : 'https://github.com/JayPuff/node-server-template.git'), (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            console.log(chalk.hex('#9e3952')('Could not clone project template, is git setup properly?'));
            return;
        }
    
        console.log(chalk.hex('#bada55')('> Cloned Project Template'));

        fs.copy(path + "/" + name + "/" + ((program.type == 'webpack') ? "webpack-project" : "node-server-template") , path + "/" + name, function (err) {
            if (err) {
                console.log(chalk.hex('#9e3952')('Could not copy files to destination directory'));
                return; 
            }
            console.log(chalk.hex('#bada55')('> Copied cloned files successfully'));

            fs.removeSync(path + "/" + name + "/.git");
            fs.removeSync(path + "/" + name + ((program.type == 'webpack') ? "/webpack-project" : "/node-server-template"));

            npmInstall();

        });

    }); 
}

function npmInstall() {
    exec('cd ' + path + "/" + name + ' && npm install', (err, stdout, stderr) => {
        if (err) {
            console.log(chalk.hex('#9e3952')('Could not npm install dependencies, do you have npm installed?'));
            return;
        }
    
        console.log(chalk.hex('#bada55')('> Installed NPM dependencies'));

        initGit();
    }); 
}


function initGit() {
    exec('cd ' + path + "/" + name + ' && git init && git add . && git commit -a -m "Initial Automated Commit"', (err, stdout, stderr) => {
        if (err) {
            console.log(chalk.hex('#9e3952')('Could not initialize git'));
            return;
        }
    
        console.log(chalk.hex('#bada55')('> Git was initialized!'));

        openEditor();
    }); 
}


//https://stackoverflow.com/questions/2423777/is-it-possible-to-create-a-remote-repo-on-github-from-the-cli-without-opening-br/10325316#10325316
// Use API to to create repository optionally??
// Can I try to fetch token/user from node env variables ?



function openEditor() {
    exec('code ' + path + "/" + name + ((program.type == 'webpack') ? " " + path + "/" + name + '/src/app.js' : ''), (err, stdout, stderr) => {
        if (err) {
            console.log(chalk.hex('#9e3952')('Could not open Editor (Do you have the editor command in PATH?)'));
            return;
        }
    
        console.log(chalk.hex('#bada55')('> Launched Project in editor!'));

        if(program.type == "webpack") {
            beginWebPackServer();
        }
    }); 
}


function beginWebPackServer() {
    exec('start cmd.exe @cmd /k "cd ' + path + "/" + name + ' && npm start"', (err, stdout, stderr) => {
        if (err) {
            console.log(chalk.hex('#9e3952')('Could not run npm start command'));
            return;
        }
    
        console.log(chalk.hex('#bada55')('> Running npm start command from project.'));
    });
}


// function beginServer() {
//     exec('start cmd @cmd /k nodemon ' + path + "/" + name + "/server.js", (err, stdout, stderr) => {
//         if (err) {
//             console.log(chalk.hex('#9e3952')('Could not start server with nodemon, retrying regularly.'));
//             beginRegularServer();
//             return;
//         }
    
//         console.log(chalk.hex('#bada55')('> Launched Server!'));
        
//         launchBrowser();
//     }); 
// }

// function beginRegularServer() {
//     exec('start cmd @cmd /k node ' + path + "/" + name + "/server.js ", (err, stdout, stderr) => {
//         if (err) {
//             console.log(chalk.hex('#9e3952')('Could not start server!'));
//             return;
//         }
    
//         console.log(chalk.hex('#bada55')('> Launched Server!'));
        
//         setTimeout(launchBrowser,1000);
//     }); 
// }



// function launchBrowser() {
//     exec('start chrome http://localhost:8000', (err, stdout, stderr) => {
//         if (err) {
//             console.log(chalk.hex('#9e3952')('Could not open browser'));
//             return;
//         }
    
//         console.log(chalk.hex('#bada55')('> Launched Browser!'));
//     }); 
// }

