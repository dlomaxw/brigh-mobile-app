package com.bproperties.app.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.ui.Alignment
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.bproperties.app.viewmodel.AdminViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddPropertyScreen(
    viewModel: AdminViewModel,
    onBack: () -> Unit
) {
    var title by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var price by remember { mutableStateOf("") }
    var type by remember { mutableStateOf("Apartment") }
    var city by remember { mutableStateOf("Kampala") }
    var bedrooms by remember { mutableStateOf("") }
    var bathrooms by remember { mutableStateOf("") }
    var size by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Add Property") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            OutlinedTextField(value = title, onValueChange = { title = it }, label = { Text("Title") }, modifier = Modifier.fillMaxWidth())
            OutlinedTextField(value = description, onValueChange = { description = it }, label = { Text("Description") }, modifier = Modifier.fillMaxWidth(), minLines = 3)
            OutlinedTextField(value = price, onValueChange = { price = it }, label = { Text("Price ($)") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())
            OutlinedTextField(value = city, onValueChange = { city = it }, label = { Text("City") }, modifier = Modifier.fillMaxWidth())
            
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(value = bedrooms, onValueChange = { bedrooms = it }, label = { Text("Beds") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.weight(1f))
                OutlinedTextField(value = bathrooms, onValueChange = { bathrooms = it }, label = { Text("Baths") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.weight(1f))
            }
            
            OutlinedTextField(value = size, onValueChange = { size = it }, label = { Text("Size (sqm)") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.fillMaxWidth())

            // Image URL Input
            var imageUrl by remember { mutableStateOf("") }
            val images = remember { mutableStateListOf<String>() }

            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = imageUrl, 
                    onValueChange = { imageUrl = it }, 
                    label = { Text("Image URL") }, 
                    modifier = Modifier.weight(1f)
                )
                Button(onClick = { 
                    if (imageUrl.isNotBlank()) {
                        images.add(imageUrl.trim())
                        imageUrl = ""
                    }
                }) {
                    Text("Add")
                }
            }

            // Display added images
            if (images.isNotEmpty()) {
               Text("Images:", style = MaterialTheme.typography.labelLarge)
               images.forEachIndexed { index, url ->
                   Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
                       Text(
                           text = url, 
                           maxLines = 1, 
                           style = MaterialTheme.typography.bodySmall, 
                           modifier = Modifier.weight(1f).padding(end = 8.dp)
                       )
                       IconButton(onClick = { images.removeAt(index) }) {
                           Icon(Icons.Default.Delete, "Remove")
                       }
                   }
               }
            }

            Button(
                onClick = {
                    viewModel.createProperty(
                        title, description, price, type,
                        city, bedrooms.toIntOrNull() ?: 0, bathrooms.toIntOrNull() ?: 0, size.toDoubleOrNull() ?: 0.0,
                        images
                    ) {
                        onBack()
                    }
                },
                modifier = Modifier.fillMaxWidth().height(50.dp),
                enabled = !viewModel.loading
            ) {
                if (viewModel.loading) {
                    CircularProgressIndicator(color = MaterialTheme.colorScheme.onPrimary)
                } else {
                    Text("Create Property")
                }
            }
        }
    }
}
