package com.bproperties.app.viewmodel

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.bproperties.app.data.BPropertiesApi
import com.bproperties.app.data.Property
import kotlinx.coroutines.launch

class PropertyViewModel : ViewModel() {
    private val api = BPropertiesApi.create()

    var properties by mutableStateOf<List<Property>>(emptyList())
        private set
    
    var selectedProperty by mutableStateOf<Property?>(null)
        private set

    var searchQuery by mutableStateOf("")
        private set

    var selectedCategory by mutableStateOf("All")
        private set

    var loading by mutableStateOf(true)
        private set

    init {
        fetchProperties()
    }

    fun onSearchQueryChange(query: String) {
        searchQuery = query
        fetchProperties()
    }

    fun onCategoryChange(category: String) {
        selectedCategory = category
        fetchProperties()
    }

    private fun fetchProperties() {
        viewModelScope.launch {
            loading = true
            try {
                // Determine type filter
                val typeFilter = if (selectedCategory == "All") null else selectedCategory
                
                properties = api.getProperties(
                    search = if (searchQuery.isBlank()) null else searchQuery,
                    type = typeFilter
                )
                android.util.Log.d("PropertyViewModel", "Properties fetched: ${properties.size} for ${searchQuery}/${typeFilter}")
            } catch (e: Exception) {
                android.util.Log.e("PropertyViewModel", "Error fetching properties", e)
                e.printStackTrace()
            } finally {
                loading = false
            }
        }
    }

    fun submitLead(name: String, email: String, phone: String, message: String, onSuccess: () -> Unit) {
        val propertyId = selectedProperty?.id ?: return
        viewModelScope.launch {
            loading = true
            try {
                api.createLead(com.bproperties.app.data.LeadRequest(propertyId, name, email, phone, message))
                android.util.Log.d("PropertyViewModel", "Lead submitted successfully")
                onSuccess()
            } catch (e: Exception) {
                android.util.Log.e("PropertyViewModel", "Error submitting lead", e)
                e.printStackTrace()
            } finally {
                loading = false
            }
        }
    }

    fun fetchPropertyById(id: String) {
        // First try to find in existing list to show immediately
        val existing = properties.find { it.id == id }
        if (existing != null) {
            selectedProperty = existing
        }
        
        // Then fetch fresh data
        viewModelScope.launch {
            loading = true
            try {
                selectedProperty = api.getProperty(id)
                android.util.Log.d("PropertyViewModel", "Fetched details for property: ${selectedProperty?.title}")
            } catch (e: Exception) {
                android.util.Log.e("PropertyViewModel", "Error fetching property details", e)
                e.printStackTrace()
            } finally {
                loading = false
            }
        }
    }

    var favorites by mutableStateOf<List<Property>>(emptyList())
        private set

    fun fetchFavorites() {
        viewModelScope.launch {
            try {
                favorites = api.getFavorites()
                android.util.Log.d("PropertyViewModel", "Favorites fetched: ${favorites.size}")
            } catch (e: Exception) {
                android.util.Log.e("PropertyViewModel", "Error fetching favorites", e)
            }
        }
    }

    fun toggleFavorite(property: Property) {
        viewModelScope.launch {
            try {
                // Optimistic update
                val isFav = favorites.any { it.id == property.id }
                if (isFav) {
                    favorites = favorites.filter { it.id != property.id }
                } else {
                    favorites = favorites + property
                }

                // API Call
                api.toggleFavorite(com.bproperties.app.data.FavoriteRequest(property.id))
                
                // Refresh to be sure
                fetchFavorites()
            } catch (e: Exception) {
                android.util.Log.e("PropertyViewModel", "Error toggling favorite", e)
                fetchFavorites() // Revert on error
            }
        }
    }
}
