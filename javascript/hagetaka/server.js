var express = require('express');
var http = require('http');
var io = require('socket.io')();

// expressアプリョン生成
var app = http.createServer();

//serverを生成
var server = app.listen(8080, "127.0.0.1", function () {
    console.log('%s: Node server started on %s:%d ...', Date(Date.now()));
});

// socket.ioを設定
io.attach(server);



// ロジック処理
var logic = require('./test.js');

// 待機中フラグ
var waitPlayer = "0";

// 一時部屋ID
var tmpRoomId;

//接続確立時の処理
io.sockets.on('connection', function (socket) {
    //接続切断処理
    socket.on('disconnect', function () {
        console.log("disconnect");
    });

    //ログイン時処理
    socket.on('login', function (userName) {
        // 待機中プレイヤーが居る場合
        if (waitPlayer == "1") {
            // 待機中の部屋IDにjoin
            socket.join(tmpRoomId);

            // ユーザ名リストを作成
            var nameList = new Array();

            // 待機中ユーザ名と新規ユーザ名を追加
            nameList.push(tmpName);
            nameList.push(name);

            // Dtoを生成
            var speedDto = logic.createSpeedDto(tmpRoomId, nameList);

            waitPlayer = "0";

            // 対戦処理を呼び出し
            io.to(tmpRoomId).emit('battle', speedDto);

            // 待機中プレイヤーが居ない場合
        } else {
            // 待機プレイヤーに1を設定
            waitPlayer = "1";

            // 部屋IDを生成
            tmpRoomId = logic.createRoomId();
            socket.join(tmpRoomId);

            // ユーザ名を一時変数に追加
            tmpName = name;
        }
    });
});
