var tasktype = $("[name=tasktype]");
var handletype = $("[name=handletype]");
var taskname = $("[name=taskname]");
var taskcourse = $("[name=taskcourse]");
var select_in = $("#mycont-taskdetailcont select");

var cid = encodeURI(request("cid"));//章节id
var tid = encodeURI(request("tid"));//任务id
var role = encodeURI(request("role"));//角色(初始化、教师)
var basePath = '';
var loadPath = '';
var savePath = '';
if (role === 'init') {
    $(".cont_edit").show();
    $(".scoreStep").parent().removeClass("hide");
    basePath = '/init-content/';
    loadPath = '/init-content/content-detail';
    savePath = '/init-content/save-content'
} else {
    basePath = '/teacher-content/';
    loadPath = '/teacher-content/my-content-detail';
    savePath = '/teacher-content/save-teacher-content'
}
if (role === "teacher") {
    $(".cont_edit").show();
}
var container_con = document.getElementById("taskTopo");//网络拓扑

var myPlayer;//初始化设置播放器

/*初始化视频上传*/
$("#video").fileinput({
    theme: "fa",
    uploadUrl: basePath + "upload-video",//上传文件路径
    uploadExtraData: {},//上传文件时额外传递的参数设置
    deleteUrl: "#",//删除时的请求路径
    deleteExtraData: "",//删除时额外传入的参数
    language: 'zh', //设置语言
    showPreview: true,//是否显示预览区域
    showCaption: false,//是否显示被选文件的简介
    showRemove: true,//是否显示移除按钮
    showProgress: false,//是否显示进度条
    dropZoneEnabled: false,//是否显示拖拽区域
    showClose: false,//是否显示关闭按钮
    showUploadedThumbs: false,//是否显示预览图
    maxFileSize: 512000,
    //autoReplace:true,//是否自动替换当前图片，设置为true时，再次选择文件， 会将当前的文件替换掉。
    //previewFileType: "video",//预览文件类型,内置['image', 'html', 'text', 'video', 'audio', 'flash', 'object',‘other‘]等格式
    allowedFileExtensions: ["mp4", "wmv", "rmvb"],
    hideThumbnailContent: true // hide image, pdf, text or other content in the thumbnail preview
});
var video_url = '';
$("#video").on("fileuploaded", function (event, data, previewId, index) {
    video_url = data.response.datas.url;
    $(this).attr("video_url", video_url);
});
$("#video").closest(".file-input").delegate(".fileinput-remove", "click", function () {
    if (!video_url == '') {
        deletFiles(video_url, $("#video"), "video_url");
    } else {
        $("#video").fileinput('refresh');
    }
});

/**
 *@desc 上传文件删除函数
 *@author 633
 *@date 2018/04/18 09:30:22
 */
function deletFiles(url, el, param) {
    $.ajax({
        type: "post",
        url: basePath + "remove-file",
        data: { url: url },
        success: function (msg) {
            if (msg.status == 1) {
                el.attr(param, '');
                el.fileinput('refresh');
            }
        },
        error: function () {
            $("body").xTip({
                type: "warning",
                message: "请求失败!"
            });
        }
    })
}

/*初始化课件上传*/
$("#taskfile").fileinput({
    theme: "fa",
    uploadUrl: basePath + "upload-ppt",//上传文件路径
    uploadExtraData: {},//上传文件时额外传递的参数设置
    deleteUrl: "",//删除时的请求路径
    deleteExtraData: "",//删除时额外传入的参数
    language: 'zh', //设置语言
    showPreview: true,//是否显示预览区域
    showCaption: false,//是否显示被选文件的简介
    showRemove: true,//是否显示移除按钮
    showProgress: false,//是否显示进度条
    dropZoneEnabled: false,//是否显示拖拽区域
    showClose: false,//是否显示关闭按钮
    showUploadedThumbs: false,//是否显示预览图
    //autoReplace:true,//是否自动替换当前图片，设置为true时，再次选择文件， 会将当前的文件替换掉。
    //previewFileType: "video",
    allowedFileExtensions: ["ppt", "pptx"],
    hideThumbnailContent: true // hide image, pdf, text or other content in the thumbnail preview
});
var taskFile_url = '';
$("#taskfile").on("fileuploaded", function (event, data, previewId, index) {
    taskFile_url = data.response.datas.url;
    $(this).attr("taskFile_url", taskFile_url);
});
$("#taskfile").closest(".file-input").delegate(".fileinput-remove", "click", function () {
    if (!taskFile_url == '') {
        deletFiles(taskFile_url, $("#taskFile"), "taskFile_url");
    } else {
        $("#taskfile").fileinput('refresh');
    }
});

/**
 * @func
 * @desc  加载内容的ajax
 * @param {string}  id  任务id
 */
function ajax_load(type, load_fun) {
    $.ajax({
        type: "post",
        url: loadPath,
        data: {
            tid: tid,
            type: type
        },
        datatype: "json",
        success: function (redata) {
            if (redata.status == 1) {
                var data = redata.datas;
                if (data.type == 1) {
                    $(".scoreStep").parent().hide();
                }
                if (data.type == 3) {
                    $(".videobox").parent().hide();
                }
                myPlayer = initVideo(myPlayer, "#cvideo", data.video_url || "");
                load_fun(data);
            } else if (redata.error.msg) {
                $("body").xTip({
                    type: "warning",
                    message: redata.error.msg
                });
            }
        },
        error: function (XMLHttpRequest, textStatus) {
            $("body").xTip({
                type: "warning",
                message: "请求失败!"
            });
        }
    })
}

var img_select = true;//监听上传未
var task_type;

function base_load(data) {
    var basaInfo = data.base_data;
    console.log(JSON.stringify(basaInfo))
    $(".editBase").show();
    $(".saveBase").hide();
    $(".simulate-box").hide();
    taskname.attr('disabled', true);
    taskcourse.attr('disabled', true);
    $(":radio[name=testType]").attr('disabled', true);
    $("input[name=know_point]").attr('disabled', true).val(basaInfo.know_point);
    $("textarea[name=testCard]").attr('disabled', true).val(basaInfo.card);
    $("input[name=group_num]").attr('disabled', true).val(basaInfo.group_num);
    taskname.val(basaInfo.task_name);
    taskcourse.val(basaInfo.task_num);
    $(".tech").text(basaInfo.direction);
    $(".chapter").text(basaInfo.project);
    task_type = basaInfo.type;
    if (basaInfo.type === "1") {
        $(".testTag").text("普通任务");
    } else if (basaInfo.type === "2") {
        $(".testTag").text("模拟器任务");
        if (data.image_url) {
            var url = data.image_url;
            if ($("#image").size()) {
                $("#image").remove();
            }
            $(".simulate-box").remove("#image").append('<input id="image" name="image_url" type="file" class="file"  image_url="' + basaInfo.image_url + '" filename="' + basaInfo.img_file_name + '">');
            $(".simulate-box .file-input").remove()
            $("#image").fileinput({
                theme: "fa",
                uploadUrl: basePath + "upload-img",//上传文件路径
                uploadExtraData: {},//上传文件时额外传递的参数设置
                deleteUrl: "#",//删除时的请求路径
                deleteExtraData: "",//删除时额外传入的参数
                language: 'zh', //设置语言
                showPreview: true,//是否显示预览区域
                showCaption: false,//是否显示被选文件的简介
                showRemove: true,//是否显示移除按钮
                showProgress: false,//是否显示进度条
                dropZoneEnabled: false,//是否显示拖拽区域
                showClose: false,//是否显示关闭按钮
                showUploadedThumbs: false,//是否显示预览图
                autoReplace: true,//是否自动替换当前图片，设置为true时，再次选择文件， 会将当前的文件替换掉。
                initialPreview: [url],
                initialPreviewConfig: [
                    { caption: basaInfo.img_file_name, size: basaInfo.img_file_size, key: 1 }],
                initialPreviewAsData: true,
                previewFileType: "image",
                allowedFileExtensions: ["jpg", "png", "jpeg"],

                hideThumbnailContent: true // hide image, pdf, text or other content in the thumbnail preview
            });
            var image_url = '';
            $("#image").on("fileselect", function (event, data, previewId, index) {
                img_select = false;
            });
            $('#image').on('filecleared', function (event) {
                img_select = true;
            });
            $("#image").on("fileuploaded", function (event, data, previewId, index) {
                //console.log(data.response.datas.url);
                image_url = data.response.datas.url;
                $(this).attr("image_url", image_url).attr("filename", data.response.datas.filename);
                img_select = true;
            });
            $("#image").closest(".file-input").delegate(".fileinput-remove", "click", function () {
                var image = $(this).closest(".file-input").find("input[type=file]").attr("image_url");
                if (image) {
                    $(this).closest(".file-input").find("input[type=file]").attr("image_url", "").fileinput('refresh');
                    //deletFiles(image, $("#image"), "image_url");
                }
            });
        }
    } else {
        $(".testTag").text("设计任务");
    }
    $(":radio[name=testType][value=" + basaInfo.level + "]").attr("checked", true);
}


var taskDetail = editormd("task-detail", getMarkdownConfig(
    {
        width: "100%",
        height: 420,
        readOnly: true,
        toolbar: false,
    }
));

function detail_load(data) {
    $(".editDetail").show();
    $(".saveDetail").hide();
    taskDetail.setMarkdown(data.detail);
    taskDetail.watch();
    taskDetail.config("readOnly", true);
    taskDetail.hideToolbar("toolbar", false);
}

function videobox_load(data) {
    $(".editVideo").show();
    $(".saveVideo").hide();
    if (data.video_url == '' || data.video_url == null) {
        $(".notresource").noData();
        $("#videobox").find("#havevideo").hide();
    } else {
        $(".notresource").hide();
        $("#videobox").find("#havevideo").show();
        $("#modify_video").hide();
        $("#havevideo").find("#cvideo").show(); //让视频显示
        var video_url = data.video_url;
        $("#video").attr("video_url", video_url);
        myPlayer.src({ "type": "video/mp4", "src": video_url });
    }
}

function taskFile_load(data) {
    $(".editTaskFile").show();
    $(".saveTaskFile").hide();
    $("#modify_file").hide();
    if (data.html_url == '' || data.html_url == null || data.ppt_url == "") {
        $(".notresource").noData();
        $("#taskFile").find("#haveFile").hide();
    } else {
        $(".notresource").hide();
        $("#taskFile").find("#haveFile").show();
        var html_url = data.html_url;
        $("#taskfile").attr("taskFile_url", data.ppt_url);
        initppt($('#pptBox'), html_url);
    }
}

/**
 *@description 添加任务步骤
 */
// 添加任务--算法文件目录
$.ajax({
    type: "post",
    url: "/content-manage/taskpaths",
    dataType: "json",
    success: function (response) {
        if (response.status == 1) {
            var datas = response.datas;
            for (i of datas) {
                $("#file-menu").append('<option value="' + i + '">' + i + '</option>');
            }
        } else {
            //请求失败
            $("body").xTip({
                type: "warning",
                message: response.msg
            });
        }
    },
    error: function () {
        $("body").xTip({
            type: "warning",
            message: "请求失败！"
        });
    }
});

// 定义任务环境--算法文件目录
$.ajax({
    type: "post",
    url: "/content-manage/experimentpaths ",
    dataType: "json",
    success: function (response) {
        if (response.status == 1) {
            var data = response.datas;
            for (i of data) {
                $("#file-topo-menu").append('<option value="' + i + '">' + i + '</option>');
            }
        } else {
            //请求失败
            $("body").xTip({
                type: "warning",
                message: response.msg
            });
        }
    },
    error: function () {
        $("body").xTip({
            type: "warning",
            message: "请求失败！"
        });
    }
});

var key_upload = false;
/*上传秘钥*/
$("#key-file").fileinput({
    theme: "fa",
    uploadUrl: "/content-manage/pwdfile",//上传文件路径
    uploadExtraData: {},//上传文件时额外传递的参数设置
    deleteUrl: "#",//删除时的请求路径
    deleteExtraData: "",//删除时额外传入的参数
    language: 'zh', //设置语言
    showPreview: true,//是否显示预览区域
    showCaption: false,//是否显示被选文件的简介
    showRemove: true,//是否显示移除按钮
    showProgress: false,//是否显示进度条
    dropZoneEnabled: false,//是否显示拖拽区域
    showClose: false,//是否显示关闭按钮
    showUploadedThumbs: false,//是否显示预览图
    //autoReplace:true,//是否自动替换当前图片，设置为true时，再次选择文件， 会将当前的文件替换掉。
    allowedFileExtensions: [],
    hideThumbnailContent: true // hide image, pdf, text or other content in the thumbnail preview
});
var key_url_datas = '';
$("#key-file").on("fileuploaded", function (event, data, previewId, index) {
    key_upload = true;
    key_url_datas = data.response.datas;
});
$("#key-file").on("fileselect", function () {
    key_upload = false;
});
$("#key-file").closest(".file-input").delegate(".fileinput-remove", "click", function () {
    key_upload = false;
    deletFiles(key_url_datas.url, $("#key-file"), "key_url");
    $('#key-file').fileinput('reset');
    $('#key-file').fileinput('refresh');
});

/* 秘钥类型切换 */
$("input[name=key]").change(function () {
    if ($(this).attr("id") == "key-str") {
        $(".key-str").show();
        $(".key-certificate").hide();
    } else if ($(this).attr("id") == "key-certificate") {
        $(".key-str").hide();
        $(".key-certificate").show();
    } else {
        $(".key-str").hide();
        $(".key-certificate").hide();
    }
})

/* 清空添加任务框内容 */
$('#task-setp').on('hide.bs.modal', function () {
    $("#task-setp input[type=text]").val("");
    $("#task-setp input[type=radio][value=1]").prop("checked", true);
    $("#task-setp select").val("0");
    $(".key-str,.key-certificate").hide();
    $('#key-file').fileinput('reset');
    $('#key-file').fileinput('refresh');
    key_upload = false;
})

/* 添加任务--提交验证 */
var k_v = "";
var key_value_list = [];
$("#task-setp .btn-key-add").click(function () {
    var taskname_reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
    var tasksort_reg = /^([1-9]\d{0,1}|100)$/;
    var taskscore_reg = /^100$|^(\d|[1-9]\d)$/;
    var clear_reg = /[\u4e00-\u9fa5]+$/;
    if (!taskname_reg.test($("#task-name").val())) {
        $("body").xTip({
            type: "warning",
            message: "请输入合法的任务名称！"
        });
        return false;
    }
    if (!tasksort_reg.test($("#task-sort").val())) {
        $("body").xTip({
            type: "warning",
            message: "请输入合法的任务排序！"
        });
        return false;
    }
    if (!taskscore_reg.test($("#task-score").val())) {
        $("body").xTip({
            type: "warning",
            message: "请输入合法的任务分数！"
        });
        return false;
    }
    if ($("#file-menu").val() == 0) {
        $("body").xTip({
            type: "warning",
            message: "请选择算法文件目录！"
        });
        return false;
    }
    if ($("[name=key]:checked").val() == 3 && !key_upload) {
        $("body").xTip({
            type: "warning",
            message: "请上传证书秘钥文件！"
        });
        return false;
    }
    if ($("[name=key]:checked").val() == 2 && $("#key-str-val").val() == "") {
        $("body").xTip({
            type: "warning",
            message: "请输入秘钥字符串！"
        });
        return false;
    }
    if ($("[name=key]:checked").val() == 2) {
        k_v = $("#key-str-val").val();
    } else if ($("[name=key]:checked").val() == 3) {
        k_v = key_url_datas;
    }

    //明文密文验证
    if ($("#clear-text").val() != "" || $("#cipher-text").val() != "") {
        if (clear_reg.test($("#clear-text").val()) || clear_reg.test($("#cipher-text").val())) {
            $("body").xTip({
                type: "warning",
                message: "明文、密文不能含有中文！"
            });
            return false;
        }
    }

    if (indData === "") {
        key_value_list.push({
            name: $("#task-name").val(),
            sort: $("#task-sort").val(),
            score: $("#task-score").val(),
            menu: $("#file-menu").val(),
            algorithm: $("input[name=encryption]:checked").val(),
            key: $("input[name=key]:checked").val(),
            key_value: k_v,
            clear_text: $("#clear-text").val(),
            cipher_text: $("#cipher-text").val()
        })
    } else {
        var id = key_value_list[indData].id
        key_value_list[indData] = {
            id: id,
            name: $("#task-name").val(),
            sort: $("#task-sort").val(),
            score: $("#task-score").val(),
            menu: $("#file-menu").val(),
            algorithm: $("input[name=encryption]:checked").val(),
            key: $("input[name=key]:checked").val(),
            key_value: k_v,
            clear_text: $("#clear-text").val(),
            cipher_text: $("#cipher-text").val()
        }
    }

    stepTabel(key_value_list, true)
    $('#task-setp').modal('hide');

})

/**
 *
 * @Author   少侠
 * @DateTime 2018-10-18
 * @param    type 操作  arr 数据
 * 任务步骤表格生成
 */
function stepTabel(arr, enable) {
    $("#add-task-list tbody").empty()
    arr.map(function (item, index) {
        var keyStr = (item.key == 1 ? '无秘钥' : (item.key == 2 ? '秘钥字符串' : "证书秘钥文件"))
        $("#add-task-list tbody").append(
            '<tr>' +
            '<td>' + item.name + '</td>' +
            '<td>' + item.sort + '</td>' +
            '<td>' + item.score + '</td>' +
            '<td>' + (item.algorithm == 1 ? "加密" : "解密") + '</td>' +
            '<td>' + keyStr + '</td>' +
            '<td class="text-center"><a href="#" data-id="' + index + '" data-toggle="modal" data-target="#task-setp" class="edit ' + (enable ? "" : "disabled") + '">编辑</a><a href="#" data-id="' + index + '" class="delete ' + (enable ? "" : "disabled") + '">移除</a></td>' +
            '</tr>');
    });
}

$("#task-btn input").click(function () {
    indData = "";
    console.log(indData);
})
// 数据回填
var indData = "";

function backBlank(data) {
    $("#task-name").val(data.name)
    $("#task-sort").val(data.sort)
    $("#task-score").val(data.score)
    var encryptionStr = "input[name=encryption][value=" + data.algorithm + "]";
    $(encryptionStr).click();
    var keyStr = "input[name=key][value=" + data.key + "]";
    if (data.key == 2) {
        $("#key-str-val").val(data.key_value);
    }
    if (data.key == 3) {
        key_upload = true;
        key_url_datas = data.key_value;
    }
    $("#file-menu").val(data.menu);
    $(keyStr).click();
    $("#clear-text").val(data.clear_text)
    $("#cipher-text").val(data.cipher_text)
}

var deleteArr = []
/* 移除试验项 */
$("#add-task-list tbody").on("click", "a", function (e) {
    e.preventDefault();
    var parents = $(this).parents("tr");
    indData = parents.index()
    console.log(indData)
    if ($(this).hasClass("disabled")) {
        return false
    }
    if ($(this).hasClass("edit")) {
        backBlank(key_value_list[indData])
    }
    if ($(this).hasClass("delete")) {
        if (key_value_list[indData].id) {
            deleteArr.push(key_value_list[indData].id)
        }
        key_value_list.splice(parents.index(), 1);
        parents.remove();
    }
})

function scoreStep_load(data) {
    key_value_list = data
    $(".editScoreStep").show();
    $(".saveScoreStep").hide();
    $("#task-btn").hide();
    deleteArr = []
    if (data && data.length == 0) {
        $(".notresource").noData();
        $(".scores").hide();
    } else {
        $(".notresource").hide();
        $("#add-task-list tbody").empty();
        stepTabel(data);
        $(".scoreItem").each(function () {
            var type = $(this).attr("type");
            $(this).find(":radio[value=" + type + "]").trigger("click");
        });
        $(".scores input,.scores :radio,.scores .btn").each(function () {
            $(this).attr('disabled', true);
        })
        $(".delScore").each(function () {
            $(this).hide();
        })
    }
}

function taskStep_load(data) {
    $(".editScoreStep").show();
    $(".saveScoreStep").hide();
    $(".addScore").hide();
    if (data.scoreItems == "" || data.scoreItems == null) {
        $(".notresource").noData();
        $(".scores").hide();
    } else {
        $(".notresource").hide();
        $(".scores").empty().show();
        var scoreItem = data.scoreItems;
        scoreAppend(scoreItem);
        $(".scoreItem").each(function () {
            var type = $(this).attr("type");
            $(this).find(":radio[value=" + type + "]").trigger("click");
        });
        $(".scores input,.scores :radio,.scores .btn").each(function () {
            $(this).attr('disabled', true);
        })
        $(".delScore").each(function () {
            $(this).hide();
        })
    }
}

var topoData = '';

function taskTopo_load(data) {
    topoData = data;
    $(".editTopo").show();
    $(".saveTopo").hide();
    if (data.type == 1) {
        $("#topo-1").show();
        $("#topo-2").hide();
        viewTopo(data.topo);
    }
    if (data.type == 3) {
        $("#topo-2").show();
        $("#topo-1").hide();
        viewTopo2(data.base_data)
    }
    $("#modify_topo").hide();

}

function viewTopo(id) {
    var url = basePath + 'topo-view?id=' + id;
    $("#topoFrame").attr("src", url);
    $("#topoFrame").attr("topoid", id);
}

function viewTopo2(data) {
    $("#simultaneously").val(data.vm_num);
    $("#file-topo-menu").val(data.path);
    $("#simultaneously").attr("disabled", true);
    $("#file-topo-menu").attr("disabled", true);
    $("#task-language").attr("disabled", true);
}

var content_type = 0;

function report_load(data) {
    $(".editReport").show();
    $(".saveReport").hide();
    // if (data.report_data == "" || data.report_data == null) {
    //     $(".notresource").noData();
    //     $(".haveReport").hide();
    // } else {
    //     $(".notresource").hide();
    //     $(".haveReport").show();
    //
    // }
    if (content_type) { //0是上传1是报告单
        //        $(".scoreStep,.taskTopo").hide();
        var report_data = eval('(' + data.report_data + ')');
        report_back(report_data);
        $("#container input,#container textarea").each(function () {
            $(this).attr("readonly", true);
        });
        $(".addQuesBtn,.add_distracter_btn,:checkbox").each(function () {
            $(this).attr('disabled', true);
        });
        $(".operate a,.quesDelImg,.delDistracter").each(function () {
            $(this).hide();
        })
    } else {
        //if (data.presentation_path) {
        var url = data.presentation_path;
        var name = data.presentation_name;
        var size = data.presentation_size;
        var downLoadUrl = data.presentation_path;
        if (!url) {
            $(".reportDownload").hide();
        } else {
            $(".reportDownload a").attr("href", downLoadUrl);
            $(".reportDownload a").attr("download", name);
        }
        $(".inputBox").empty().append('<input id="report" name="presentation_file" type="file" class="file"  report_url="' + url + '" report_name="' + name + '">');
        $("#report").fileinput({
            theme: "fa",
            uploadUrl: "/content-manage/presentationfile",//上传文件路径
            uploadExtraData: {},//上传文件时额外传递的参数设置
            deleteUrl: "#",//删除时的请求路径
            deleteExtraData: "",//删除时额外传入的参数
            language: 'zh', //设置语言
            showPreview: true,//是否显示预览区域
            showCaption: false,//是否显示被选文件的简介
            showRemove: true,//是否显示移除按钮
            showProgress: false,//是否显示进度条
            dropZoneEnabled: false,//是否显示拖拽区域
            showClose: false,//是否显示关闭按钮
            showUploadedThumbs: false,//是否显示预览图
            maxFileSize: 1024000,
            autoReplace: true,//是否自动替换当前图片，设置为true时，再次选择文件， 会将当前的文件替换掉。
            initialPreview: [url],
            initialPreviewConfig: [
                { caption: name, size: size, key: 1 }],
            initialPreviewAsData: true,
            allowedFileExtensions: ["doc", "docx"],
            hideThumbnailContent: true // hide image, pdf, text or other content in the thumbnail preview
        });
        var report_url = '';
        $("#report").on("fileuploaded", function (event, data, previewId, index) {
            //console.log(data.response.datas.url);
            report_url = data.response.datas.url;
            $(this).attr("report_url", report_url).attr("report_name", data.response.datas.filename);
        }).on('fileuploaderror', function (event, data, msg) {
            //上传失败回调
        });
        $("#report").closest(".file-input").delegate(".fileinput-remove", "click", function () {
            // if(report_url !==''){
            //     // deletFiles(report_url,$("#report"),"report_url");
            // // ajax_load("report", report_load);
            // }else {
            //     $("#report").fileinput('refresh');
            // }
            $("#report").attr("report_url", "null"),
                $("#report").attr("report_name", "null")
            $("#report").fileinput('refresh');
        });
        $(".reportUpload input,.reportUpload .btn").each(function () {
            $(this).attr('disabled', true);
        });
        //}
    }
}

function exam_load(data) {
    $(".editExam").show();
    $(".saveExam").hide();
    $(".addExam").hide();
    if (data.examItems == "" || data.examItems == null) {
        $(".notresource").noData();
        $(".examItems").hide();
    } else {
        $(".notresource").hide();
        $(".examItems").show().empty();
        var examItem = data.examItems;
        examAppend(examItem);
        $(".examItem").each(function () {
            var right = $(this).find(".answer-box").attr("right");
            var type = $(this).attr("examtype");
            examAnswerAppend($(this), type, right);
        });
        $(".examItems input,.examItems textarea,:radio,:checkbox").each(function () {
            $(this).attr('disabled', true);
        });
        $(".delExam").each(function () {
            $(this).hide();
        })
    }
}

/**
 * @func
 * @desc  加载任务详情
 * @param {string}  id  任务id
 */
$(".nav li").click(function () {
    var tab = $(this).find("a");
    if (tab.hasClass("baseInfo")) {
        ajax_load("base", base_load);
    } else if (tab.hasClass("detail")) {
        ajax_load("detail", detail_load);
    } else if (tab.hasClass("videobox")) {
        ajax_load("videobox", videobox_load);
    } else if (tab.hasClass("taskFile")) {
        ajax_load("taskFile", taskFile_load);
    } else if (tab.hasClass("scoreStep")) {
        ajax_load("taskStep", scoreStep_load);
    } else if (tab.hasClass("taskTopo")) {
        ajax_load("taskTopo", taskTopo_load);
    } else if (tab.hasClass("report")) {
        ajax_load("report", report_load);
    } else if (tab.hasClass("exam")) {
        ajax_load("exam", exam_load);
    }
});

/**
 * @func
 * @desc  保存内容的ajax
 * @param {string}  id  任务id
 */
function ajax_save(data, load_fun) {
    var arg = arguments;
    $.ajax({
        type: "post",
        url: savePath,
        data: data,
        datatype: "json",
        success: function (redata) {
            if (redata.status == 1) {
                $("body").xTip({
                    type: "success",
                    message: "保存成功！"
                });
                if (arg.length == 2) {
                    load_fun(data)
                }
                ;
            } else if (redata.error.msg) {
                $("body").xTip({
                    type: "warning",
                    message: redata.error.msg
                });
            }
        },
        error: function (XMLHttpRequest, textStatus) {
            $("body").xTip({
                type: "warning",
                message: "请求失败!"
            });
        }
    })
}

function base_save() {
    ajax_load("base", base_load);
}

function videobox_save() {
    ajax_load("videobox", videobox_load);
}

function scoreStep_save() {
    ajax_load("taskStep", scoreStep_load);
}

function report_save() {
    ajax_load("report", report_load);
}

function exam_save() {
    ajax_load("exam", exam_load);
}

function topo_save() {
    ajax_load("taskTopo", taskTopo_load);
}

function taskFile_save() {
    ajax_load("taskFile", taskFile_load);
}

/*编辑 保存*/
$(".control-cont").click(function () {
    var top_data;
    var data = "";
    if ($(this).hasClass("editBase")) {
        $(this).hide();
        $(".saveBase").show();
        taskname.removeAttr("disabled");
        taskcourse.removeAttr("disabled");
        $(":radio[name=testType]").removeAttr("disabled");
        $("input[name=know_point]").removeAttr("disabled");
        $("textarea[name=testCard]").removeAttr("disabled");
        if ($(".testTag").text() === "模拟器任务") {
            $(".simulate-box").show();
        }
    } else if ($(this).hasClass("saveBase")) {
        top_data = checkTop(taskname.val(), taskcourse.val());
        if ($("textarea[name = testCard]").val().trim() == "") {
            $("body").xTip({
                type: "warning",
                message: "请输入任务指导书内容！"
            });
            return false;
        }
        if (top_data) {
            data = {
                task_id: tid,
                tab: "base",
                base_data: {
                    task_name: top_data.taskname,
                    class_num: top_data.taskcourse,
                    level: $(":radio[name=testType]:checked").val(),
                    know_point: $(".know_point").val(),
                    card: $("textarea[name=testCard]").val(),
                    image_url: $("#image").attr("image_url")
                }
            };
            ajax_save(data, base_save);
            $(this).hide();
            $(".editBase").show();
        }
    } else if ($(this).hasClass("editDetail")) {
        $(this).hide();
        $(".saveDetail").show();
        taskname.removeAttr("disabled");
        taskcourse.removeAttr("disabled");
        taskDetail.config("readOnly", false);
        taskDetail.config("toolbar", true);
    } else if ($(this).hasClass("saveDetail")) {
        top_data = checkTop(taskname.val(), taskcourse.val());
        if (top_data) {
            data = {
                task_id: tid,
                tab: "detail",
                task_name: top_data.taskname,
                class_num: top_data.taskcourse,
                detail: taskDetail.getMarkdown()
            };
            ajax_save(data);
            taskDetail.watch();
            taskDetail.config("readOnly", true);
            taskDetail.hideToolbar();
            $(this).hide();
            $(".editDetail").show();
        }
    } else if ($(this).hasClass("editVideo")) {
        $(this).hide();
        $(".saveVideo").show();
        $(".notresource").hide();
        $("#havevideo").show();
        $("#modify_video").show();
        if ($("#video").attr("video_url") == '' || $("#video").attr("video_url") == null) {
            $("#havevideo").find("#cvideo").hide();
        } else {
            $("#havevideo").find("#cvideo").show(); //让视频显示
        }
        taskname.removeAttr("disabled");
        taskcourse.removeAttr("disabled");
    } else if ($(this).hasClass("saveVideo")) {
        top_data = checkTop(taskname.val(), taskcourse.val());
        if (top_data) {
            data = {
                task_id: tid,
                tab: "videobox",
                task_name: top_data.taskname,
                class_num: top_data.taskcourse,
                video_url: $("#video").attr("video_url")
            };
            ajax_save(data, videobox_save);

            $(this).hide();
            $(".editVideo").show();
        }
    } else if ($(this).hasClass("editTaskFile")) {
        $(this).hide();
        $(".saveTaskFile").show();
        $(".notresource").hide();
        $("#haveFile").show();
        $("#modify_file").show();
        taskname.removeAttr("disabled");
        taskcourse.removeAttr("disabled");
    } else if ($(this).hasClass("saveTaskFile")) {
        top_data = checkTop(taskname.val(), taskcourse.val());
        var taskfile_url = $("#taskfile").attr("taskfile_url");
        if (taskfile_url == "") {
            $("body").xTip({
                type: "warning",
                message: "请选择文件！"
            });
            return false;
        }
        if (top_data) {
            data = {
                task_id: tid,
                tab: "taskFile",
                task_name: top_data.taskname,
                class_num: top_data.taskcourse,
                taskFile_url: taskfile_url
            };
            ajax_save(data, taskFile_save);

            $(this).hide();
            $(".editTaskFile").show();
        }
    } else if ($(this).hasClass("editScoreStep")) {
        $(this).hide();
        $(".saveScoreStep").show();
        $(".notresource").hide();
        $(".scores").show();
        $(".addScore").show();
        taskname.removeAttr("disabled");
        taskcourse.removeAttr("disabled");
        $("#task-btn").show();
        $("#add-task-list tbody td a").removeClass('disabled');
        // if ($(".scores .scoreItem").size() == 0){
        //     $(".addScore input").trigger("click");
        // }
        // $(".scores input,.scores :radio,.scores .btn").each(function () {
        //     $(this).attr('disabled',false);
        // });
        // $(".delScore").each(function () {
        //     $(this).show();
        // })
    } else if ($(this).hasClass("saveScoreStep")) {
        var error_msg2 = checkScore();
        if (error_msg2 != "") {
            $("body").xTip({
                type: "warning",
                message: error_msg2
            });
            return false;
        }
        top_data = checkTop(taskname.val(), taskcourse.val());
        var score_data = saveScore();
        if (score_data) {
            if (top_data) {
                data = key_value_list;
                data = {
                    task_id: tid,
                    task_name: top_data.taskname,
                    class_num: top_data.taskcourse,
                    tab: "taskStep",
                    list: key_value_list,
                    del_arr: deleteArr
                };
                ajax_save(data, scoreStep_save);
                $("#add-task-list tbody td a").addClass('disabled');
                $(this).hide();
                $("#task-btn").hide();
                $(".editScoreStep").show();
            }
        }
    } else if ($(this).hasClass("editReport")) {
        $(this).hide();
        $(".saveReport").show();
        $(".notresource").hide();
        // $(".haveReport").show();
        if (content_type) {
            $("#container input,#container textarea").each(function () {
                $(this).attr("readonly", false);
            });
            $(".addQuesBtn,.add_distracter_btn,:checkbox").each(function () {
                $(this).attr('disabled', false);
            });
            $(".operate a,.quesDelImg,.delDistracter").each(function () {
                $(this).show();
            })
        } else {
            $(".reportUpload input,.reportUpload .btn").each(function () {
                $(this).attr('disabled', false);
            });
        }
    } else if ($(this).hasClass("saveReport")) {                         //保存报告
        var error_msg;
        top_data = checkTop(taskname.val(), taskcourse.val());
        if (content_type) {
            error_msg = checkRport();

        } else {
            error_msg = checkRport2();
        }
        // if (error_msg != "") {
        //     $("body").xTip({
        //         type: "warning",
        //         message: error_msg
        //     });
        //     return false;
        // }
        if (content_type) {
            data = {
                task_id: tid,
                task_name: top_data.taskname,
                class_num: top_data.taskcourse,
                tab: "report",
                report_cont: saveRecord()
            };
        } else {
            data = {
                task_id: tid,
                task_name: top_data.taskname,
                class_num: top_data.taskcourse,
                tab: "report",
                presentation_path: $("#report").attr("report_url"),
                presentation_name: $("#report").attr("report_name")
            };
        }
        ajax_save(data, report_save);

        $(this).hide();
        $(".editReport").show();
    } else if ($(this).hasClass("editExam")) {
        $(this).hide();
        $(".saveExam").show();
        $(".notresource").hide();
        $(".examItems").show();
        $(".addExam").show();
        taskname.removeAttr("disabled");
        taskcourse.removeAttr("disabled");
        $(".examItems input,.examItems textarea,:radio,:checkbox").each(function () {
            $(this).attr('disabled', false);
        });
        $(".delExam").each(function () {
            $(this).show();
        })
    } else if ($(this).hasClass("saveExam")) {
        top_data = checkTop(taskname.val(), taskcourse.val());
        var error_msg = checkExam();
        if (error_msg != "") {
            $("body").xTip({
                type: "warning",
                message: error_msg
            });
            return false;
        }
        var exam_data = savaExam();
        if (exam_data) {
            if (top_data) {
                data = {
                    task_id: tid,
                    tab: "exam",
                    task_name: top_data.taskname,
                    class_num: top_data.taskcourse,
                    exam_cont: exam_data
                };
                ajax_save(data, exam_save);

                $(this).hide();
                $(".editExam").show();
            }
        }
    } else if ($(this).hasClass("editTopo")) {
        $(this).hide();
        $(".saveTopo").show();
        //$(".notresource").hide();
        $("#modify_topo").show();
        if (topoData.type == 1) {
            $("#topo-1").show();
            $("#topo-2").hide();
        }
        if (data.type == 3) {
            $("#topo-2").show();
            $("#topo-1").hide();
        }
        taskname.removeAttr("disabled");
        taskcourse.removeAttr("disabled");
        $("#simultaneously").attr("disabled", false);
        $("#file-topo-menu").attr("disabled", false);
        $("#task-language").attr("disabled", false);

    } else if ($(this).hasClass("saveTopo")) {
        if (topoData.type == 1) {
            top_data = checkTop(taskname.val(), taskcourse.val());
            var topoid = $("#topoFrame").attr("topoid");
            if (top_data) {
                data = {
                    task_id: tid,
                    tab: "taskTopo",
                    task_name: top_data.taskname,
                    class_num: top_data.taskcourse,
                    topo_cont: topoid
                };
                ajax_save(data, topo_save);
                $(this).hide();
                $(".editTopo").show();
            }
        }
        if (topoData.type == 3) {
            top_data = checkTop(taskname.val(), taskcourse.val());
            var pwdData = checkPwd()
            if (pwdData && topoData.type == 3) {
                pwdData.task_id = tid;
                pwdData.task_name = top_data.taskname;
                pwdData.class_num = top_data.taskcourse;
                pwdData.tab = "taskTopo";
                ajax_save(pwdData, topo_save);
                $(this).hide();
                $(".editTopo").show();
            }
        }

    }

})

// 检查是否上传
function checkRport2() {
    var error_msg = "";
    var report_url = $("#report").attr("report_url");
    if (!report_url) {
        error_msg = "请上传任务报告!";
    }
    return error_msg;
}

function MaxValue(value) {
    var val = value.trim();
    if (val.length != 0) {
        reg = /^[\d]+$/;
        if (reg.test(val) && val <= parseInt('20')) {//判断是否为数字类型
            return true;
        } else {
            return false;
        }
    }
    return false;
}

function checkPwd() {
    var taskInfo = {};
    var reg = /^([1-9]|1[0-9]|20)$/;
    if (!reg.test($("#simultaneously").val())) {
        $("body").xTip({
            type: "warning",
            message: "请输入1-20位使用人数！"
        });
        return false;
    }
    if (!MaxValue($("#simultaneously").val())) {
        $("body").xTip({
            type: "warning",
            message: "请输入不大于20的整数！"
        });
        return false;
    }
    if ($("#file-topo-menu").val() == "0") {
        $("body").xTip({
            type: "warning",
            message: "请选择算法文件目录！"
        });
        return false;
    }
    // if($("#task-parent").val() == "0"){
    //     $("body").xTip({
    //         type: "warning",
    //         message: "请选择母本！"
    //     });
    //     return false;
    // }
    taskInfo.people = $("#simultaneously").val();
    taskInfo.path = $("#file-topo-menu").val();
    taskInfo.language = $("#task-language").val();
    return taskInfo;
}

/**
 * @func
 * @desc  验证保存任务名称、课时数
 * @param {string}  id  任务id
 */
function checkTop(taskname, taskcourse) {
    $(".manage-redfont").hide();
    //if (original_name != taskname) {
    var re = /^[1-9]\d*$/;
    //var flag =  checkTaskName(taskname);
    // if (flag == 1) {
    //     return;
    // }
    if (taskname != "" && taskcourse != "") {
        if (re.test(taskcourse)) {
            if (taskcourse > 16) {
                $("body").xTip({
                    type: "warning",
                    message: "课时数最大值为16"
                });
                return false;
            }
        } else {
            $("body").xTip({
                type: "warning",
                message: "课时只能为正整数"
            });
            return false;
        }
        return { taskname: taskname, taskcourse: taskcourse }
    } else {
        $("body").xTip({
            type: "warning",
            message: "任务名称和课时数不能为空"
        });
        return false;
    }
    //}
}

var is_repeat = 0;

/*验证试验名称是否重复*/
function checkTaskName(task_name) {
    // $.ajax({
    //     url:"/teachercontent/checktaskname",
    //     data:{task_name:task_name},
    //     async:false,
    //     type:'post',
    //     success:function(data){
    //         if (data.status == 0) {
    //             $("body").xTip({
    //                 type:"warning",
    //                 message:data.error.msg
    //             });
    //             is_repeat = 1;
    //         }
    //     },
    //     error:function(){
    //         $("body").xTip({
    //             type:"warning",
    //             message:"请求失败!"
    //         });
    //     }
    // })
    // return is_repeat;
    return 0;
}


/**
 * @func
 * @desc  遍历获取的内容并添加到页面
 */
var $mtbody = $("#taskTopo select[name=name]");

function append(redata) {
    var html = "";
    $.each(redata.datas.data, function () {
        html += '<option value="' + this.id + '">' + this.name + '</option>';
    });
    $mtbody.empty().append(html);
}

/**
 *@description 选择拓扑弹窗
 *@author jjw
 */
$("#selectTopo ").click(function () {
    $.ajax({
        type: "post",
        url: "/init-content/create-topo",
        dataType: "json",
        success: function (response) {
            if (response.status == 1) {
                //请求成功
                var data = response.data;
                bootbox.dialog({
                    title: "选择拓扑",
                    message: data,
                    className: "selectTopo"
                });

            } else {
                //请求失败
                $("body").xTip({
                    type: "warning",
                    message: response.msg
                });
            }
        },
        error: function () {
            $("body").xTip({
                type: "warning",
                message: "请求失败！"
            });
        }
    });
});

$(function () {
    ajax_load("base", base_load);
});













