#!/usr/bin/env node
const { exec } = require('child_process');
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
    exec('cd ' + path + "/" + name + ' && git clone https://github.com/JayPuff/node-server-template.git', (err, stdout, stderr) => {
        if (err) {
            console.log(chalk.hex('#9e3952')('Could not clone project template, is git setup properly?'));
            return;
        }
    
        console.log(chalk.hex('#bada55')('> Cloned Project Template'));

        fs.copy(path + "/" + name + "/" + "node-server-template" , path + "/" + name, function (err) {
            if (err) {
                console.log(chalk.hex('#9e3952')('Could not copy files to destination directory'));
                return; 
            }
            console.log(chalk.hex('#bada55')('> Copied cloned files successfully'));

            fs.removeSync(path + "/" + name + "/.git");
            fs.removeSync(path + "/" + name + "/node-server-template");

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


function openEditor() {
    exec('code ' + path + "/" + name, (err, stdout, stderr) => {
        if (err) {
            console.log(chalk.hex('#9e3952')('Could not open Editor (Do you have the editor command in PATH?)'));
            return;
        }
    
        console.log(chalk.hex('#bada55')('> Launched Project in editor!'));
    }); 
}

