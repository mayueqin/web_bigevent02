$(function() {
    initArtCateList()

    //1.为添加分类按钮绑定点击事件 显示弹出层
    var indexAdd = null; //预先保存弹出层的索引值
    $('#btnAddCate').on('click', function() {
        indexAdd = layui.layer.open({
            type: 1,
            area: ['500px', '300px'], //设置弹出层大小范围
            title: '添加文章分类',
            content: $('#dialog-add').html() //设置弹出层内容,这里content是一个普通的String
        })
    })

    //发送Ajax请求实现添加文章分类功能  由于弹出层是未来元素，不能直接绑定事件，可以使用事件委托
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('添加文章分类失败')
                }
                layui.layer.msg('添加文章分类成功');
                initArtCateList();
                // 根据索引，关闭对应的弹出层
                layui.layer.close(indexAdd);
            }
        })
    })

    var form = layui.form;
    //2.为编辑分类按钮绑定点击事件 显示弹出层
    var indexEdit = null; //预先保存弹出层的索引值
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layui.layer.open({
            type: 1,
            area: ['500px', '300px'], //设置弹出层大小范围
            title: '修改文章分类',
            content: $('#dialog-edit').html() //设置弹出层内容,这里content是一个普通的String
        })
        var id = $(this).attr('data-id');
        //发送请求给服务器，根据id获取当前分类的信息渲染表单
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类失败')
                }
                // layui.layer.msg('获取文章分类成功')

                form.val('formEditCate', res.data)
            }
        })

    })

    //发送Ajax请求,修改并更新分类
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);

                if (res.status !== 0) {
                    return layui.layer.msg('修改分类失败')
                }
                layui.layer.msg('修改分类成功')
                initArtCateList();
                layui.layer.close(indexEdit);
            }
        })
    })


    //为删除分类按钮添加点击事件
    $('tbody').on('click', '.btn-delete', function() {
        //获取id值
        var id = $(this).attr('data-id');
        console.log(id);
        layui.layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //确认删除就发送请求删除分类
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    console.log(res)
                    if (res.status !== 0) {
                        return layui.layer.msg('删除分类失败');
                    }
                    layui.layer.msg('删除分类成功');
                    //关闭询问框
                    layui.layer.close(index);
                    //重新渲染页面
                    initArtCateList()
                }
            })

        })

    })


})

//初始化文章分类列表
function initArtCateList() {
    $.ajax({
        type: 'get',
        url: '/my/article/cates',
        success: function(res) {
            // console.log(res);
            var htmlStr = template('art_cateTpl', res);
            $('tbody').html(htmlStr);
        }
    })
}