$(function() {
    initUserInfo()
        //验证昵称
    var form = layui.form;
    form.verify({
            nickname: function(value) {
                if (value.length > 6) {
                    return '昵称长度必须在1~6个字符之间'
                }
            }
        })
        //初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败')
                }
                console.log(res);

                //快速为表单赋值 
                form.val('formUserInfo', res.data)

            }
        })
    }
    //监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/my/userinfo',
                data: $(this).serialize(),
                success: function(res) {
                    console.log(res)
                    if (res.status !== 0) {
                        return layui.layer.msg('用户信息修改失败')
                    }
                    //如果修改成功
                    layui.layer.msg('用户信息修改成功');
                    // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                    window.parent.getUserInfo()
                }
            })
        })
        //重置表单
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo()
    })

})