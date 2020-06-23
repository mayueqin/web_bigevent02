$(function() {
    //为注册按钮添加点击事件
    $('#link_reg').on('click', function() {
            $('.reg-box').show()
            $('.login-box').hide()
        })
        //为登录按钮添加点击事件
    $('#link_login').on('click', function() {
            $('.login-box').show()
            $('.reg-box').hide()
        })
        //自定义验证规则
    var form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，不能有空格'],
        repwd: function(value) {
            var pwd = $('.reg-box [name = password]').val();
            if (value !== pwd) {
                return '两次密码不一致'
            }
        }
    })

})