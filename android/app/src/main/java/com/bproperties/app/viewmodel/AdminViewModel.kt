package com.bproperties.app.viewmodel

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.bproperties.app.data.BPropertiesApi
import com.bproperties.app.data.Lead
import com.bproperties.app.data.Property
import com.bproperties.app.data.PropertyRequest
import kotlinx.coroutines.launch

class AdminViewModel(application: Application) : AndroidViewModel(application) {
    private val api = BPropertiesApi.create()

    var loading by mutableStateOf(false)
        private set
    
    var leads by mutableStateOf<List<Lead>>(emptyList())
        private set
        
    var properties by mutableStateOf<List<Property>>(emptyList())
        private set

    var error by mutableStateOf<String?>(null)
        private set

    fun fetchLeads() {
        viewModelScope.launch {
            loading = true
            try {
                leads = api.getLeads()
            } catch (e: Exception) {
                // e.printStackTrace() // Logcat
                error = "Error: ${e.message}"
            } finally {
                loading = false
            }
        }
    }

    fun fetchProperties() {
        viewModelScope.launch {
            loading = true
            try {
                properties = api.getProperties()
            } catch (e: Exception) {
                // e.printStackTrace() // Logcat
                error = "Error: ${e.message}"
            } finally {
                loading = false
            }
        }
    }

    fun createProperty(
        title: String, description: String, price: String, type: String,
        city: String, bedrooms: Int, bathrooms: Int, size: Double,
        images: List<String>,
        onSuccess: () -> Unit
    ) {
        viewModelScope.launch {
            loading = true
            try {
                val mediaRequests = images.map { com.bproperties.app.data.MediaRequest(it) }
                val request = PropertyRequest(
                    title, description, price, type, "AVAILABLE", city, bedrooms, bathrooms, size, null, mediaRequests
                )
                api.createProperty(request)
                fetchProperties() // Refresh list
                onSuccess()
            } catch (e: Exception) {
                // e.printStackTrace() // Logcat
                error = "Error: ${e.message}"
            } finally {
                loading = false
            }
        }
    }
    
    fun updateProperty(
        id: String,
        title: String, description: String, price: String, type: String,
        city: String, bedrooms: Int, bathrooms: Int, size: Double,
        images: List<String>,
        onSuccess: () -> Unit
    ) {
        viewModelScope.launch {
            loading = true
            try {
                val mediaRequests = images.map { com.bproperties.app.data.MediaRequest(it) }
                val request = PropertyRequest(
                    title, description, price, type, "AVAILABLE", city, bedrooms, bathrooms, size, null, mediaRequests
                )
                api.updateProperty(id, request)
                fetchProperties() // Refresh list
                onSuccess()
            } catch (e: Exception) {
                // e.printStackTrace() // Logcat
                error = "Error: ${e.message}"
            } finally {
                loading = false
            }
        }
    }

    fun deleteProperty(id: String) {
        viewModelScope.launch {
            loading = true
            try {
                api.deleteProperty(id)
                fetchProperties()
            } catch (e: Exception) {
                // e.printStackTrace() // Logcat
                error = "Error: ${e.message}"
            } finally {
                loading = false
            }
        }
    }

    fun fetchProperty(id: String, onSuccess: (Property) -> Unit) {
        viewModelScope.launch {
            // Don't set global loading here to avoid flickering logic if we want, but sticking to pattern:
            loading = true
            try {
                val property = api.getProperty(id)
                onSuccess(property)
            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                loading = false
            }
        }
    }
}
