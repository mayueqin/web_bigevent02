$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1, //相当于1/1
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3调用cropper方法 根据配置项创建裁剪区域
    $image.cropper(options)
        //为上传按钮添加点击事件
    $('#btnChooseImg').on('click', function() {
        $('#file').click()
    })


    // 为文件选择框绑定 change 事件
    $('#file').on('change', function(e) {
            // 获取用户选择的文件
            var filelist = e.target.files
            console.log(filelist);

            if (filelist.length === 0) {
                return layer.msg('请选择照片！')
            }

            // 1. 拿到用户选择的文件
            var file = e.target.files[0];
            console.log(file);

            // 2. 将文件，转化为路径
            var imgURL = URL.createObjectURL(file)
            console.log(imgURL);

            // 3. 重新初始化裁剪区域
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', imgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        //点击上传按钮实现头像上传至服务器
    $('#btnUpload').on('click', function() {
        //获取用户裁剪过后的头像
        var dataURL = $image.cropper('getCroppedCanvas', {
                //创建一个画布
                width: 100,
                height: 100
            }).toDataURL('image/png') //将 Canvas 画布上的内容，转化为 base64 格式的字符串
            //调用接口，把头像上传至服务器
        $.ajax({
            type: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更换头像失败')
                }
                layui.layer.msg('更换头像成功');
                window.parent.getUserInfo()
            }
        })
    })


})