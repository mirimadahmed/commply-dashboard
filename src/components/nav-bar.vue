
<script>
import simplebar from "simplebar-vue";

/**
 * Nav-bar Component
 */
export default {
  components: { simplebar },
  methods: {
    toggleMenu() {
      this.$parent.toggleMenu();
    },
    initFullScreen() {
      document.body.classList.toggle("fullscreen-enable");
      if (
        !document.fullscreenElement &&
        /* alternative standard method */ !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(
            Element.ALLOW_KEYBOARD_INPUT
          );
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },
    logout() {
      this.$router.push('/logout');
    }
  }
};
</script>

<template>
  <header id="page-topbar">
    <div class="navbar-header">
      <div class="d-flex">
        <!-- LOGO -->
        <div class="navbar-brand-box">
          <router-link tag="a" to="/employee-dashboard" class="logo logo-dark">
            <span class="logo-lg">
              <img src="@/assets/images/logo1.png" alt height="50" />
            </span>
            Commply
          </router-link>

          <router-link tag="a" to="/employee-dashboard" class="logo logo-light">
            <span class="logo-lg">
              <img src="@/assets/images/logo1.png" alt height="50" />
            </span>
            Commply
          </router-link>
        </div>

        <button
          id="vertical-menu-btn"
          type="button"
          class="btn btn-sm px-3 font-size-16 header-item"
          @click="toggleMenu"
        >
          <i class="fa fa-fw fa-bars"></i>
        </button>
      </div>

      <div class="d-flex">
        <div class="dropdown d-none d-lg-inline-block ml-1">
          <button type="button" class="btn header-item noti-icon" @click="initFullScreen">
            <i class="bx bx-fullscreen"></i>
          </button>
        </div>
        <div class="dropdown d-none d-lg-inline-block ml-1">
          <router-link tag="a" to="/logout">
            <button type="button" class="btn header-item noti-icon text-danger" @click="logout">
            <i class="bx bx-power-off font-size-16 align-middle mr-1 text-danger"></i>
            {{ $t('navbar.dropdown.henry.list.logout') }}
          </button>
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>
