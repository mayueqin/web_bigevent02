//*******************更新修改后的文章的功能实现代码*******************//
$(function() {
    // 初始化富文本编辑器
    // initEditor()
    var layer = layui.layer
    var form = layui.form
    initCate()

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
        // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        // 获取到文件的列表数组
        var files = e.target.files
            // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])

        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //为选择封面的按钮，绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    //定义文章的发布状态
    var art_state = '已发布'

    // 为存为草稿按钮，绑定点击事件
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    // 为表单绑定 submit 提交事件  收集好数据
    $('#form-edit').on('submit', function(e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
            // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0])
            // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state)
            // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        }).toBlob(function(blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 5. 将文件对象，存储到 fd 中
            fd.append('cover_img', blob)

            // 6.调用publishArticle函数 发起 ajax 数据请求
            publishArticle(fd)
        })
    })

    //定义函数，发送请求实现发布更新的文章
    function publishArticle(fd) {

        $.ajax({
            type: 'post',
            url: '/my/article/edit',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res);

                if (res.status !== 0) {
                    return layui.layer.msg('修改文章失败')
                }
                layui.layer.msg('修改文章成功')
                location.href = "/article/art_list.html"
            }
        })
    }
})



//*******************展示文章列表的功能实现代码*******************//

$(function() {
    initCate()
    initTable()

})
var form = layui.form;
var laypage = layui.laypage; //使用layui的laypage后面用于分页
//获取文章分类列表数据
function initCate() {
    $.ajax({
        type: 'get',
        url: '/my/article/cates',
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('获取文章分类列表失败！')
            }
            // console.log(res);

            //使用模板引擎
            var htmlStr = template('tpl-cate', res);
            $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构，必须要写这行代码，否则即使模板渲染了也不会显示在页面
            form.render()
        }
    })
}

// 定义一个查询的参数对象，将来请求数据的时候，
// 需要将请求参数对象提交到服务器
var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
}

//实现筛选功能
$('#form-search').on('submit', function(e) {
    e.preventDefault();
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    console.log(q);

    // 根据最新的筛选条件，重新渲染表格的数据
    initTable()
})

// 定义美化时间的过滤器
template.defaults.imports.dataFormat = function(date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
}

// 定义补零的函数
function padZero(n) {
    return n > 9 ? n : '0' + n
}


// 定义渲染分页的方法
function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
        elem: 'pageBox', // 分页容器的 Id
        count: total, // 总数据条数
        limit: q.pagesize, // 每页显示几条数据
        curr: q.pagenum, // 设置默认被选中的分页
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10],
        // 分页发生切换的时候，触发 jump 回调
        // 触发 jump 回调函数的有两种方式：
        // 1. 点击页码的时候，会触发 jump 回调
        // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
        jump: function(obj, first) {
            // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
            // 如果 first 的值为 true，证明是方式2触发的
            // 否则就是方式1触发的
            // console.log(first)
            // console.log(obj.curr)
            // 把最新的页码值，赋值到 q 这个查询参数对象中
            q.pagenum = obj.curr
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
            q.pagesize = obj.limit
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                // initTable()
                //第一次的时候不执行（会造成死循环），当点击页码的时候重新调用initTable渲染当前页的数据
            if (!first) {
                initTable()
            }
        }
    })
}

//请求文章列表数据使用模板引擎渲染列表
function initTable() {
    $.ajax({
        type: 'get',
        url: '/my/article/list',
        data: q,
        success: function(res) {
            // console.log(res);

            if (res.status !== 0) {
                return layer.msg('获取文章列表失败！')
            }
            // 使用模板引擎渲染页面的数据
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
                // console.log(res.total);

            // 调用渲染分页的方法
            renderPage(res.total)
        }
    })
}


//删除文章   为删除按钮添加点击事件
$('tbody').on('click', '.btn-delete', function() {
    //获取删除按钮的个数
    var len = $('.btn-delete').length;
    //获取当前id值
    var id = $(this).attr('data-id');
    // console.log(id);

    layui.layer.confirm('确认删除吗？', { icon: 3, title: '提示' }, function(index) {
        //发送请求删除文章
        $.ajax({
            type: 'get',
            url: '/my/article/delete/' + id,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('删除文章失败！')
                }
                layer.msg('删除文章成功！')
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    // 4
                if (len === 1) {
                    // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                    // 页码值最小必须是 1
                    q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                }
                initTable()
            }
        })
    })

})

//渲染数据到修改文章表单
$('tbody').on('click', '.btn-edit', function() {
    $('#editbox').show();
    $('#showbox').hide();
    var id = $(this).attr('data-id');
    $.ajax({
        type: 'get',
        url: '/my/article/' + id,
        success: function(res) {
            console.log(res);
            res.data.content = res.data.content.replace(/p|\/|<|>/g, '')
            $('#image').attr('src', 'http://ajax.frontend.itheima.net' + res.data.cover_img)
            form.val('form-edit', res.data)

        }
    })
})