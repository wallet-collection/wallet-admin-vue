<template>
  <div class="login-container">
    <el-form class="card-box login-form" autoComplete="on" :model="ruleForm" :rules="rules" ref="ruleForm"
             label-position="left">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="username" class="item">
        <el-input
            placeholder="用户名"
            name="username"
            autoComplete="on"
            v-model="ruleForm.username">
        </el-input>
      </el-form-item>
      <el-form-item prop="password" class="item">
        <el-input
            placeholder="密码"
            name="pwd" :type="isShowPwd ? 'text' : 'password'"
            @keyup.enter.native="handleLogin"
            v-model="ruleForm.password"
            autoComplete="on">
        </el-input>
      </el-form-item>
      <el-form-item prop="code" class="item">
        <el-input
            placeholder="谷歌验证码，没有设置则不填"
            name="code" :type="isShowPwd ? 'text' : 'password'"
            @keyup.enter.native="handleLogin"
            v-model="ruleForm.code"
            autoComplete="on">
        </el-input>
      </el-form-item>
      <div>
        <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading"
                   @click.native="handleLogin()">登录
        </el-button>
      </div>
      <div>
      </div>
    </el-form>

  </div>
</template>

<script>
import {Login} from "../api/auth/login";
import {setMemberInit, setToken} from "../utils/userAuth";

export default {
  data() {
    let validatePwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        username: "",
        password: "",
        code: "",
        checked: true
      },
      rules: {
        username: [
          { required: true, message: "请输入登录名", trigger: "blur" }
        ],
        password: [{ validator: validatePwd, trigger: "blur" }]
      },
      isShowPwd: false, // 是否显示密码
      loading: false, // 登录loading
      redirect: null // 回调地址
    };
  },
  methods: {
    handleLogin() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          Login(this.ruleForm)
              .then(response => {
                this.loading = false;
                if (response.code) {
                  this.$message.error(response.message);
                  return;
                }
                this.$message.success("登录成功");
                setToken(response.data.token)
                setMemberInit({
                  adminId: response.data.id,
                  username: response.data.username
                })
                let path = "/";
                if (this.redirect) {
                  path = this.redirect;
                }
                this.$router.push({
                  path: path
                });
                // window.location.replace(path);
                // this.showDialog = true
              })
              .catch(() => {
                this.loading = false;
              });
        } else {
          return false;
        }
      });
    }
  },
  created() {
    // 将参数拷贝进查询对象
    let query = this.$route.query;
    if (query.redirect) {
      // URL Encode
      this.redirect = decodeURIComponent(query.redirect);
    }
  }
};
</script>

<style lang="less" scoped>

.login-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #2d3a4b;
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #293444 inset !important;
    -webkit-text-fill-color: #fff !important;
  }
  .item {
    .el-form-item__content {
      display: flex;
      flex-flow: row;
    }
  }
  input {
    background: transparent;
    border: 0;
    -webkit-appearance: none;
    border-radius: 0;
    padding: 0.46rem 0.0666rem 0.16rem 0.2rem;
    color: #eee;
    height: 100%;
  }
  .el-input {
    display: inline-block;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 0.13333rem;
  }
  .svg-container {
    padding: 0.08rem 0.0666rem 0.08rem 0.2rem;
    color: #889aa4;
    vertical-align: middle;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    color: #eee;
    margin: 0 auto 0.5333rem auto;
    text-align: center;
    font-weight: bold;
  }
  .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 22em;
    padding: 0.4666rem 0.4666rem 0.2rem 0.4666rem;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 0.0666rem;
    color: #454545;
  }
  .show-pwd {
    position: absolute;
    right: 0.1333rem;
    top: 0.09333rem;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
  }
  .thirdparty-button {
    /*position: absolute;*/
    /*right: .4666rem;*/
    /*bottom: .37333rem;*/
  }
}
</style>
