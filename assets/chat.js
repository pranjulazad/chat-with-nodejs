$(document).ready(function () {

    var socket = io.connect();
    var chatMessages = $('.chat-messages');
    var chatName = $('.chat-name');
    var chatMsg = $('.msg');
    var user = $('#user');
    var showBtn = $('.hideBtn');
    var username = $('.user');
    var alluser = $('.allUsers');
    var select = document.getElementById('selectUsers');

    $('.hideBtn').on('click', function () {
        var obj = $(this);
        var chat = $('.chat');
        //console.log(obj.text());
        if (obj.text() === 'Show Chat') {
            obj.text('Hide Chat');
            chat.show();
        } else if (obj.text() === 'Hide Chat') {
            obj.text('Show Chat');
            chat.hide();
        }
    });


    $('#btn1').click(function () {
        chatName.text(user.val());
        socket.emit('user connected', user.val(), function () {
            username.hide();
            showBtn.show();
        });
    });

    $('form').on('submit', function (e) {
        e.preventDefault();
        var sendTO = select.options[select.selectedIndex].text;
        if (chatMsg.val().length > 1) {
            socket.emit('send message', chatName.text(), chatMsg.val(), sendTO);
        }
        chatMsg.val('');
    });

    socket.on('new message', function (data) {
        //console.log(chatName.text() + ':' + data.recv);
        if ((data.recv === chatName.text() || data.name === chatName.text()) && data.recv !== '-Users Online-') {
            if (data.recv === chatName.text())
                chatMessages.append('<div class="MSG">' + data.name + ' : ' + data.msg + '</div>');
            if (data.name === chatName.text())
                chatMessages.append('<div class="MSG"> Your message To ' + data.recv + ' : ' + data.msg + '</div>');

        } else if (data.recv === '-Users Online-') {
            if (data.name === chatName.text())
                chatMessages.append('<div class="MSG"> Your message To All : ' + data.msg + '</div>');
            else {
                chatMessages.append('<div class="MSG">' + data.name + ' : ' + data.msg + '</div>');
            }
        }


        // chatMessages.append('<div class="MSG"> Your message To ' + data.recv + ' : ' + data.msg + '</div>');
    });

    socket.on('new User', function (data) {
        alluser.find('option').remove().end().append('<option>-Users Online-</option>');
        for (i = 0; i < data.length; i++) {
            if (chatName.text() === data[i]) {
                continue;
            }
            //console.log(data[i]);
            alluser.append('<option>' + data[i] + '</option>');
        }
        //chatMessages.append('<div class="MSG">New User Connected</div>');
    });

})