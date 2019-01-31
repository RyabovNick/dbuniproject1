<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>My CRUD</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.name" label="Имя"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.surname" label="Фамилия"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.date_birth" label="Дата рождения"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.n_group" label="Номер группы"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.score" label="Средний балл"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.city" label="Город"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.address" label="Адрес"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table :headers="headers" :items="students" class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td class="text-xs-right">{{ props.item.surname }}</td>
        <td class="text-xs-right">{{ props.item.date_birth }}</td>
        <td class="text-xs-right">{{ props.item.n_group }}</td>
        <td class="text-xs-right">{{ props.item.score }}</td>
        <td class="text-xs-right">{{ props.item.city }}</td>
        <td class="text-xs-right">{{ props.item.address }}</td>
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
          <v-icon small @click="deleteItem(props.item)">delete</v-icon>
        </td>
      </template>
      <template slot="no-data">
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    dialog: false,
    headers: [
      {
        text: 'Имя',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Фамилия', value: 'surname' },
      { text: 'Дата рождения', value: 'date_birth' },
      { text: 'Номер группы', value: 'n_group' },
      { text: 'Балл', value: 'score' },
      { text: 'Город', value: 'city' },
      { text: 'Адрес', value: 'address' },
      { text: 'Actions', value: 'name', sortable: false }
    ],
    students: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      surname: '',
      date_birth: '',
      n_group: 0,
      score: 0,
      city: '',
      address: ''
    },
    defaultItem: {
      name: '',
      surname: '',
      date_birth: '',
      n_group: 0,
      score: 0,
      city: '',
      address: ''
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    }
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      axios
        .get('http://localhost:8080/api/students')
        .then(response => {
          this.students = response.data
          console.log(this.students)
        })
        .catch(error => {
          console.log(error)
        })
    },

    editItem(item) {
      this.editedIndex = this.students.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      const index = this.students.indexOf(item)
      confirm('Are you sure you want to delete this item?') &&
        axios
          .delete(`http://localhost:8080/api/students/${item.n_z}`)
          .then(response => {
            console.log(response)
            this.students.splice(index, 1)
          })
          .catch(error => {
            throw error
          })
    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save() {
      if (this.editedIndex > -1) {
        console.log(this.editedItem)
        axios
          .put(
            `http://localhost:8080/api/students/${this.editedItem.n_z}`,
            this.editedItem
          )
          .then(response => {
            console.log(response)
            console.log('this.editedIndex: ', this.editedIndex)
            console.log('this.students: ', this.students)
            console.log('this.editedItem: ', this.editedItem)
            Object.assign(this.students[this.editedIndex], this.editedItem)
          })
          .catch(error => {
            throw error
          })
      } else {
        console.log(this.editedItem)
        axios
          .post('http://localhost:8080/api/students', this.editedItem)
          .then(response => {
            console.log(response)
            this.editedItem.n_z = response.data.insertId
            this.students.push(this.editedItem)
          })
          .catch(error => {
            console.log('error: ', error)
            throw error
          })
      }
      this.close()
    }
  }
}
</script>