<template>
  <!-- <div>注册</div> -->
  <div class="register-container">
    <div @click="toLogin" class="toLogin">返回</div>
    <el-form
      ref="registerForm"
      :rules="registerRules"
      :model="registerForm"
      class="register-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">注册界面</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="registerForm.username"
          placeholder="账号"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="registerForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleRegister"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <el-form-item prop="passwordAgain">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passworAgaindType"
          ref="passwordAgain"
          v-model="registerForm.passwordAgain"
          :type="passworAgaindType"
          placeholder="再次输入密码"
          name="passwordAgain"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleRegister"
        />
        <span class="show-pwd" @click="showPswAgain">
          <svg-icon
            :icon-class="
              passworAgaindType === 'password' ? 'eye' : 'eye-open'
            "
          />
        </span>
      </el-form-item>
      <!-- 邮箱 -->

      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="email"
          v-model="registerForm.email"
          placeholder="邮箱"
          name="email"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
        <el-button
          ref="getEmailCode"
          :disabled="buttonEmailCode"
          @click="sendEmailCode"
          class="emailCode"
        >
          <span>获取注册码</span>
        </el-button>
      </el-form-item>
      <!-- 邮箱验证码 -->
      <el-form-item prop="emailCode">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="emailCode"
          v-model="registerForm.emailCode"
          placeholder="注册码"
          name="emailCode"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <!-- 图片验证码 -->
      <el-form-item prop="code">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="code"
          v-model="registerForm.code"
          placeholder="验证码"
          name="code"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
        <img @click="changeCode" class="code" :src="svgImg" alt="captcha" />
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleRegister"
        >注册</el-button
      >
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    //自定义密码规则
    const validatePassword = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("请输入五位及五位以上密码"));
      } else {
        callback();
      }
    };
    //验证邮箱格式正则表达式规则
    const validateEmail = (rule, value, callback) => {
      const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!reg.test(value)) {
        this.buttonEmailCode = true;
        callback(new Error("请输入正确的邮箱格式"));
      } else {
        this.buttonEmailCode = false;
        callback();
      }
    };
    //验证passwordAgain与password是否一致
    const validatePasswordAgain = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      //获取验证码svg地址
      svgImg: "/dev-api/api/getSvgCaptcha/1",
      buttonEmailCode: true,
      registerForm: {
        username: "",
        password: "",
        passwordAgain: "",
        email: "",
        emailCode: "",
        code: "",
        //管理员账号密码 admin admin1
      },
      registerRules: {
        username: [
          { required: true, message: "账号必须输入" },
          { min: 4, message: "用户名不能小于4位" },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
        passwordAgain: [
          { required: true, trigger: "blur", validator: validatePasswordAgain },
        ],
        email: [
          {
            required: true,
            trigger: "change",
            validator: validateEmail,
          },
        ],
        emailCode: [
          {
            required: true,
            trigger: "blur",
            message: "请输入邮箱验证码",
          },
        ],
        code: [{ required: true, message: "验证码必须输入" }],
      },
      loading: false,
      passwordType: "password",
      passworAgaindType: "password",
      redirect: undefined,
    };
  },
  methods: {
    changeCode() {
      this.svgImg = "/dev-api/api/getSvgCaptcha/" + Math.random();
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    showPswAgain() {
      if (this.passworAgaindType === "password") {
        this.passworAgaindType = "";
      } else {
        this.passworAgaindType = "password";
      }
      this.$nextTick(() => {
        this.$refs.passwordAgain.focus();
      });
    },
    handleRegister() {
      this.$refs.registerForm.validate(async (valid) => {
        if (valid) {
          //验证验证码的正确性
          let captcha = document.cookie.split("=")[1];
          const { code } = this.registerForm;
          if (code != captcha) {
            this.$message.error("验证码错误");
            return;
          } else {
            this.loading = true;
            let results = await this.$API.user.reqRegister(this.registerForm);
            if (results.code == 200) {
              this.loading = false;
              this.$message.success(results.message);
              this.$router.push("/login");
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //点击获取注册码之后 获取注册码内容变为60秒倒计时且不可点击
    async sendEmailCode() {
      //倒计时
      var spanB = document.getElementsByClassName("emailCode")[0];
      let time = 30;
      let timer = setInterval(() => {
        time--;
        if (time <= 0) {
          clearInterval(timer);
          spanB.innerHTML = "获取注册码";
          this.buttonEmailCode = false;
        } else {
          spanB.innerHTML = time + "秒后重新获取";
          this.buttonEmailCode = true;
        }
      }, 1000);
      //获取注册码
      const { email } = this.registerForm;
      let results = await this.$API.user.reqGetEmailCode(email);
      if ((results.code = 200)) {
        this.$message.success(results.message);
      }
    },
    //返回登录界面
    toLogin(){
      this.$router.push("/login");
    }
  },
};
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .el-input input {
    color: $cursor;
  }
}

.register-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .register-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.emailCode {
  float: right;
  position: absolute;
  right: 10px;
  top: 7px;
}
.code {
  float: right;
  height: 40px;
  position: absolute;
  right: 10px;
  top: 5px;
  background-color: white;
}
.toLogin {
  /* font-weight: 1000; */
  font-size: 20px;
  text-decoration: underline;
  color: skyblue;
  cursor: pointer;

}
</style>
