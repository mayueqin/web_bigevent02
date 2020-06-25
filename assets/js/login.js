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
        //定义弹出层提示
    var layer = layui.layer;
    //监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
            e.preventDefault();
            var data = {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            }
            $.ajax({
                    type: 'post',
                    url: '/api/reguser',
                    data,
                    success: function(res) {
                        console.log(res);

                        if (res.status !== 0) {
                            return layer.msg(res.message)
                        }
                        layer.msg('注册成功,请登录！')
                        $('#link_login').click()
                    }
                })
                // $.post('http://ajax.frontend.itheima.net/api/reguser', data, function(res) {
                //     if (res.status !== 0) {
                //         return layer.msg(res.message)
                //     }
                //     layer.msg('注册成功，请登录！')
                //         // 模拟人的点击行为
                //     $('#link_login').click()
                // })
        })
        //监听登录表单的提交事件
    $('#form_login').on('submit', function(e) {
        e.preventDefault(); //阻止表单默认提交
        var data = $(this).serialize(); //快速获取表单数据
        $.ajax({
            type: 'post',
            url: '/api/login',
            data,
            success: function(res) {
                console.log(res);

                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登录成功')
                    // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token)
                    //跳转到后台主页
                location.href = "/index.html"
            }
        })

    })

})