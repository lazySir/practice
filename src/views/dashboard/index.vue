<template>
  <div>
    <card></card>
    <Sale></Sale>
    <Oberserve></Oberserve>
  </div>
</template>

<script>
import Card from "./Card";
import Sale from "./Sale";
import Oberserve from './Oberserve'
export default {
  name: "Dashboard",
  components: {
    Card,
    Sale,
    Oberserve
  },
};
</script>

<style scoped></style>
