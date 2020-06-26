$(function() {
    //自定义验证规则
    var form = layui.form;
    form.verify({
            pwd: [/^[\S]{6,12}$/, '密码必须是6~12位，且不能有空格！'],
            samePwd: function(value) {
                if (value == $('[name=oldPwd]').val()) {
                    return '新旧密码不能一样'
                }
            },
            rePwd: function(value) {
                if (value !== $('[name=newPwd]').val()) {
                    return '两次密码不一致'
                }
            }
        })
        //发送重置密码请求，更新密码
    $('.layui-form').on('submit', function(e) {
        e.preventDefault(); //阻止默认提交行为
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(), //快速获取表单数据
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('密码重置失败');
                }
                layui.layer.msg('密码重置成功');
                //密码重置成功后清空表单   reset()是dom元素中的方法，必须先将jq元素转换为dom
                $('.layui-form')[0].reset();
            }
        })
    })
})