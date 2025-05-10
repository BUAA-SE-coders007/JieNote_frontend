<template>
  <div>
    <div
      class="relative flex flex-col min-w-12 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0"
    >
      <div class="rounded-t bg-white mb-0 px-6 py-6">
        <div class="text-center flex justify-between">
          <h6 class="text-blueGray-700 text-xl font-bold">编辑个人信息</h6>
        </div>
      </div>
      <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form @submit.prevent="submitSettings">
          <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            用户信息
          </h6>
          <div class="flex flex-wrap">
            <div class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="username"
                >
                  用户名
                </label>
                <input
                  id="username"
                  type="text"
                  v-model="form.username"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="请输入用户名"
                />
              </div>
            </div>
          </div>

          <hr class="mt-6 border-b-1 border-blueGray-300" />

          <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            联系信息
          </h6>
          <div class="flex flex-wrap">
            <div class="w-full lg:w-12/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="address"
                >
                  地址
                </label>
                <input
                  id="address"
                  type="text"
                  v-model="form.address"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="请输入地址"
                />
              </div>
            </div>
            <div class="w-full lg:w-12/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="university"
                >
                  大学
                </label>
                <input
                  id="university"
                  type="text"
                  v-model="form.university"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="请输入大学"
                />
              </div>
            </div>
          </div>

          <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            关于我
          </h6>
          <div class="flex flex-wrap">
            <div class="w-full lg:w-12/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="introduction"
                >
                  个人介绍
                </label>
                <textarea
                    id="introduction"
                    v-model="form.introduction"
                    @input="handleIntroductionInput"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    rows="4"
                    placeholder="请输入个人介绍（最多100字）"
                    maxlength="100"
                ></textarea>
                <div :class="counterClass" class="text-right text-sm mt-1">
                  {{ form.introduction.length }}/100
                </div>
              </div>
            </div>
          </div>

          <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            上传头像
          </h6>
          <div class="flex flex-wrap items-center">
            <div class="w-full lg:w-8/12 px-4">
              <div class="relative w-full mb-3">
                <input
                  type="file"
                  @change="handleFileUpload"
                  accept="image/*"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
                <p class="text-xs text-gray-500 mt-1">仅支持 JPG/PNG/WebP 格式图片</p>
              </div>
            </div>
            <div class="w-full lg:w-4/12 px-4 flex justify-start">
              <div v-if="previewAvatar" class="ml-4">
                <img :src="previewAvatar" alt="头像预览" style="width:80px;height:80px;border-radius:50%;object-fit:cover;">
              </div>
            </div>
          </div>
          <div v-if="showCropper" class="modal-overlay">
                  <div class="modal-content" style="width:350px;">
                    <h6 class="mb-2 text-blueGray-700 font-bold">裁剪头像</h6>
                    <cropper
                      ref="cropper"
                      :src="cropperImage"
                      :stencil-component="CircleStencil"
                      :stencil-props="{
                        aspectRatio: 1,
                        handlers: {},
                        movable: false,
                        resizable: false,
                      }"
                      :autoZoom="true"
                      image-restriction="stencil"
                      style="height:220px;width:220px;background:#f5f5f5;"
                    />
                    <div class="flex justify-end mt-4 gap-2">
                      <button type="button" @click="handleCropCancel" class="px-3 py-1 rounded">取消</button>
                      <button type="button" @click="handleCropConfirm" class="px-3 py-1 rounded">确定</button>
                    </div>
                  </div>
                </div>

          <!-- 确认按钮 -->
          <div class="flex justify-end mt-6 gap-4">
            <button
                type="button"
                @click="handleSave"
                class="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              <strong style="color: black;">保存</strong>
            </button>

            <button
                type="button"
                @click="handleExit"
                class="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              <strong style="color: black;">退出</strong>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ElMessage, ElMessageBox } from 'element-plus'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

export default {
  props: {
    userData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: { ...this.userData },
      previewAvatar: null, // 新增预览URL变量
      initialForm: { ...this.userData }, // 保存初始数据用于比较
      avatar: null,
      showCropper: false, // 控制裁剪弹窗显示
      cropperImage: null, // 裁剪原图
      showChangePassword: false, // 控制修改密码窗口显示
      passwordForm: {
        oldPassword: "",
        newPassword: "",
      },
      CircleStencil: CircleStencil // 在data中引用以便模板使用
    };
  },
  watch: {
    form: {
      handler(newVal) {
        // 检测表单变化
        console.log(this.initialForm)
        console.log(this.form)
        this.hasChanges = JSON.stringify(newVal) !== JSON.stringify(this.initialForm);
        console.log(this.hasChanges);
      },
      deep: true
    }
  },
  computed: {
    counterClass() {
      const count = this.form.introduction.length;
      return {
        'text-green-500': count < 90,
        'text-yellow-500': count >= 90 && count < 100,
        'text-red-500': count >= 100
      };
    }
  },
  methods: {
    async handleSave() {
      try {
        await ElMessageBox.confirm(
            '确定要保存修改吗？',
            '确认保存',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
        );

        await this.submitSettings();
        ElMessage.success('保存成功！');
        this.initialForm = { ...this.form }; // 更新初始数据
        this.hasChanges = false;
        console.log(this.initialForm);
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('保存失败');
        }
      }
    },

    // 退出处理
    async handleExit() {
      if (this.hasChanges) {
        try {
          await ElMessageBox.confirm(
              '检测到未保存的修改，是否要保存？',
              '未保存的更改',
              {
                confirmButtonText: '保存并退出',
                cancelButtonText: '不保存退出',
                type: 'warning'
              }
          );

          await this.submitSettings();
          ElMessage.success('已保存修改');
        } catch (error) {
          if (error === 'cancel') {
            ElMessage.info('已放弃未保存的修改');
          }
        }
      }
      this.$router.push('/profile');
    },
    handleIntroductionInput() {
      // 双重保险：当用户绕过maxlength时强制截断
      if (this.form.introduction.length > this.maxLength) {
        this.form.introduction = this.form.introduction.slice(0, this.maxLength);
        this.$message.warning('已达到最大字数限制');
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.cropperImage = URL.createObjectURL(file);
        this.showCropper = true;
      }
    },
    // 裁剪确认
    async handleCropConfirm() {
      const cropper = this.$refs.cropper;
      if (cropper && cropper.getResult) {
        const result = cropper.getResult();
        if (result && result.canvas) {
          result.canvas.toBlob(blob => {
            this.avatar = blob;
            this.previewAvatar = URL.createObjectURL(blob);
            this.showCropper = false;
            if (this.cropperImage) {
              URL.revokeObjectURL(this.cropperImage);
              this.cropperImage = null;
            }
          }, 'image/png');
        }
      }
    },
    // 裁剪取消
    handleCropCancel() {
      this.showCropper = false;
      if (this.cropperImage) {
        URL.revokeObjectURL(this.cropperImage);
        this.cropperImage = null;
      }
    },
    async submitSettings() {
      try {
        const token = localStorage.getItem("authToken");
        const formData = new FormData();

        formData.append("username", this.form.username || "");
        formData.append("address", this.form.address || "");
        formData.append("university", this.form.university || "");
        formData.append("introduction", this.form.introduction || "");
        console.log(this.avatar)

        if (this.avatar) {
          formData.append("avatar", this.avatar);
          console.log(this.avatar)
        }

        console.log(formData)

        const response = await axios.put("https://jienote.top/user/update", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        console.log(response)

        this.$emit("update-user", {
          ...this.form,
          avatar: this.previewAvatar || this.userData.avatar
        });
        return true;
      } catch (error) {
        ElMessage.error('保存失败，请检查网络连接');
        throw error;
      }
    },
    async changePassword() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Token 不存在，请先登录！");
          return;
        }

        const response = await axios.post(
          "http://localhost:8000/user/password",
          {
            old_password: this.passwordForm.oldPassword,
            new_password: this.passwordForm.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json", // 确保请求体是 JSON 格式
            },
          }
        );

        console.log("密码修改成功：", response.data);
        this.showChangePassword = false; // 关闭修改密码窗口
      } catch (error) {
        console.error("修改密码失败：", error);
      }
    },
  },
  components: {
    Cropper,
    // CircleStencil // 如果在模板中直接使用 :stencil-component="CircleStencil" 且CircleStencil已导入，则无需在此注册
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
