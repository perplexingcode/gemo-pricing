<template>
  <div class="flex flex-col table-info">
    <label class="pl-4 pt-1">{{ lang('name').value }}</label>
    <input
      class="customer-name"
      v-model="session.customer"
      :placeholder="lang('yourName').value"
    />
    <label class="pl-4 pt-1">{{ lang('table').value }}</label>
    <select v-model="session.table">
      <option disabled selected value="">
        {{ lang('yourTable').value }}
      </option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </select>
  </div>
</template>
<script setup>
const session = inject('session');
const lang = inject('lang');
</script>
<style>
.table-info input,
.table-info select {
  margin-left: 1rem;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
}
</style>
