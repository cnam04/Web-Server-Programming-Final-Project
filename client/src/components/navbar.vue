<template>


<nav class="navbar" role="navigation" aria-label="main navigation">
  <div id="navbarBasicExample" class="navbar-menu" :class="{ 'is-active': isMenuOpen }">
    <div class="navbar-start">
      <a class="navbar-item" @click="closeMenu">
        Home
      </a>

      <a class="navbar-item" @click="closeMenu">
        Documentation
      </a>

      <div class="navbar-item has-dropdown is-hoverable" :class="{ 'is-active': isMoreOpen }">
        <a class="navbar-link" @click.prevent="toggleMore">
          More
        </a>

        <div class="navbar-dropdown">
          <a class="navbar-item" @click="closeAllMenus">
            About
          </a>
          <a class="navbar-item is-selected" @click="closeAllMenus">
            Jobs
          </a>
          <a class="navbar-item" @click="closeAllMenus">
            Contact
          </a>
          <hr class="navbar-divider">
          <a class="navbar-item" @click="closeAllMenus">
            Report an issue
          </a>
        </div>
      </div>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <a class="button is-primary">
            <strong>Sign up</strong>
          </a>
          <a class="button is-light" @click="closeMenu">
            Log in
          </a>
        </div>
      </div>
    </div>
  </div>
</nav>


</template>
<script>
export default {
  name: 'Navbar',
  data() {
    return {
      isMenuOpen: false,
      isMoreOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      if (!this.isMenuOpen) {
        this.isMoreOpen = false;
      }
    },
    closeMenu() {
      this.isMenuOpen = false;
      this.isMoreOpen = false;
    },
    toggleMore() {
      this.isMoreOpen = !this.isMoreOpen;
    },
    closeAllMenus() {
      this.closeMenu();
    },
  },
}
</script>

<style scoped>
.brand-logo {
  display: block;
  width: clamp(120px, 26vw, 220px);
  height: auto;
}

.navbar-brand {
  min-width: 0;
}
.navbar-end {
  margin-left: auto;
}
.navbar-start {
  margin-right: auto;
}
</style>