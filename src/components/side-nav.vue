<script>
import MetisMenu from "metismenujs/dist/metismenujs";

import { layoutMethods } from "@/state/helpers";

import { menuItems } from "./menu";
import { mapState } from "vuex";

export default {
  data() {
    return {
      menuItems: menuItems,
    };
  },
  computed: {
    ...mapState("authfack", {
      user: (state) => state.user,
    }),
  },
  mounted: function () {
    document.body.setAttribute("data-sidebar", "dark");
    // eslint-disable-next-line no-unused-vars
    var menuRef = new MetisMenu("#side-menu");
    var links = document.getElementsByClassName("side-nav-link-ref");
    var matchingMenuItem = null;
    for (var i = 0; i < links.length; i++) {
      if (window.location.pathname === links[i].pathname) {
        matchingMenuItem = links[i];
        break;
      }
    }

    if (matchingMenuItem) {
      matchingMenuItem.classList.add("active");
      var parent = matchingMenuItem.parentElement;

      /**
       * TODO: This is hard coded way of expading/activating parent menu dropdown and working till level 3.
       * We should come up with non hard coded approach
       */
      if (parent) {
        parent.classList.add("mm-active");
        const parent2 = parent.parentElement.closest("ul");
        if (parent2 && parent2.id !== "side-menu") {
          parent2.classList.add("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.add("mm-active");
            var childAnchor = parent3.querySelector(".has-arrow");
            var childDropdown = parent3.querySelector(".has-dropdown");
            if (childAnchor) childAnchor.classList.add("mm-active");
            if (childDropdown) childDropdown.classList.add("mm-active");

            const parent4 = parent3.parentElement;
            if (parent4 && parent4.id !== "side-menu") {
              parent4.classList.add("mm-show");
              const parent5 = parent4.parentElement;
              if (parent5 && parent5.id !== "side-menu") {
                parent5.classList.add("mm-active");
                const childanchor = parent5.querySelector(".is-parent");
                if (childanchor && parent5.id !== "side-menu") {
                  childanchor.classList.add("mm-active");
                }
              }
            }
          }
        }
      }
    }
  },
  methods: {
    ...layoutMethods,
    change_layout(layout) {
      return this.changeLayoutType({ layoutType: layout });
    },
    lightSidebar() {
      document.body.setAttribute("data-topbar", "dark");
      document.body.removeAttribute("data-sidebar");
      document.body.removeAttribute("data-layout-size", "boxed");
      document.body.removeAttribute("data-sidebar-size", "small");
      document.body.classList.remove("vertical-collpsed");
    },
    compactSidebar() {
      document.body.setAttribute("data-sidebar-size", "small");
      document.body.setAttribute("data-sidebar", "dark");
      document.body.removeAttribute("data-layout-size", "boxed");
      document.body.classList.remove("vertical-collpsed");
      document.body.removeAttribute("data-topbar", "dark");
    },
    iconSidebar() {
      document.body.setAttribute("data-keep-enlarged", "true");
      document.body.classList.add("vertical-collpsed");
      document.body.setAttribute("data-sidebar", "dark");
      document.body.removeAttribute("data-topbar", "dark");
      document.body.removeAttribute("data-layout-size", "boxed");
    },
    boxedLayout() {
      document.body.setAttribute("data-keep-enlarged", "true");
      document.body.classList.add("vertical-collpsed");
      document.body.setAttribute("data-layout-size", "boxed");
      document.body.removeAttribute("data-sidebar", "colored");
      document.body.setAttribute("data-sidebar", "dark");
      document.body.removeAttribute("data-topbar", "dark");
    },
    coloredSidebar() {
      document.body.setAttribute("data-sidebar", "colored");
      document.body.removeAttribute("data-layout-size", "boxed");
      document.body.removeAttribute("data-sidebar-size", "small");
      document.body.classList.remove("vertical-collpsed");
    },
    /**
     * Returns true or false if given menu item has child or not
     * @param item menuItem
     */
    hasItems(item) {
      return item.subItems !== undefined ? item.subItems.length > 0 : false;
    },
    showIt(item) {
      return item.adminOnly ? this.user.is_owner == 'false' : true;
    }
  },
};
</script>

<template>
  <!-- ========== Left Sidebar Start ========== -->

  <!--- Sidemenu -->
  <div id="sidebar-menu">
    <!-- Left Menu Start -->
    <ul id="side-menu" class="metismenu list-unstyled">
      <template v-for="item in menuItems">
        <template v-if="showIt(item)">
          <li class="menu-title" v-if="item.isTitle" :key="item.id">{{ item.label }}</li>
          <!-- Layouts menu -->
          <li v-if="item.isLayout" :key="item.id">
            <a href="javascript: void(0);" class="has-arrow">
              <i class="bx bx-layout"></i>
              <span>{{ $t('menuitems.layouts.text') }}</span>
            </a>
            <ul class="sub-menu" aria-expanded="false">
              <li>
                <a
                  href="javascript: void(0);"
                  @click="change_layout('horizontal')"
                >{{ $t('menuitems.layouts.list.horizontal') }}</a>
              </li>
              <li>
                <a
                  href="javascript: void(0);"
                  class="side-nav-link-ref"
                  @click="lightSidebar"
                >{{ $t('menuitems.layouts.list.lightsidebar') }}</a>
              </li>
              <li>
                <a
                  href="javascript: void(0);"
                  class="side-nav-link-ref"
                  @click="compactSidebar"
                >{{ $t('menuitems.layouts.list.compactsidebar') }}</a>
              </li>
              <li>
                <a
                  href="javascript: void(0);"
                  class="side-nav-link-ref"
                  @click="iconSidebar"
                >{{ $t('menuitems.layouts.list.iconsidebar') }}</a>
              </li>
              <li>
                <a
                  href="javascript: void(0);"
                  class="side-nav-link-ref"
                  @click="boxedLayout"
                >{{ $t('menuitems.layouts.list.boxed') }}</a>
              </li>
              <li>
                <a
                  href="javascript: void(0);"
                  class="side-nav-link-ref"
                  @click="coloredSidebar"
                >{{ $t('menuitems.layouts.list.coloredsidebar') }}</a>
              </li>
            </ul>
          </li>
          <!--end Layouts menu -->

          <li v-if="!item.isTitle && !item.isLayout" :key="item.id">
            <a
              v-if="hasItems(item)"
              href="javascript:void(0);"
              class="is-parent"
              :class="{'has-arrow': !item.badge, 'has-dropdown': item.badge}"
            >
              <i :class="`bx ${item.icon}`" v-if="item.icon"></i>
              <span>{{ item.label }}</span>
              <span
                :class="`badge badge-pill badge-${item.badge.variant} float-right`"
                v-if="item.badge"
              >{{ item.badge.text }}</span>
            </a>

            <router-link :to="item.link" v-if="!hasItems(item)" class="side-nav-link-ref">
              <i :class="`bx ${item.icon}`" v-if="item.icon"></i>
              <span>{{ item.label }}</span>
              <span
                :class="`badge badge-pill badge-${item.badge.variant} float-right`"
                v-if="item.badge"
              >{{ item.badge.text }}</span>
            </router-link>

            <ul v-if="hasItems(item)" class="sub-menu" aria-expanded="false">
              <li v-for="(subitem, index) of item.subItems" :key="index">
                <router-link
                  :to="subitem.link"
                  v-if="!hasItems(subitem)"
                  class="side-nav-link-ref"
                >{{ subitem.label }}</router-link>
                <a
                  v-if="hasItems(subitem)"
                  class="side-nav-link-a-ref has-arrow"
                  href="javascript:void(0);"
                >{{ subitem.label }}</a>
                <ul v-if="hasItems(subitem)" class="sub-menu mm-collapse" aria-expanded="false">
                  <li v-for="(subSubitem, index) of subitem.subItems" :key="index">
                    <router-link
                      :to="subSubitem.link"
                      class="side-nav-link-ref"
                    >{{ subSubitem.label }}</router-link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </template>
      </template>
    </ul>
  </div>
  <!-- Sidebar -->
</template>
