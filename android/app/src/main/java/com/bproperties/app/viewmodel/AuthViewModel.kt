package com.bproperties.app.viewmodel

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.bproperties.app.data.BPropertiesApi
import com.bproperties.app.data.LoginRequest
import com.bproperties.app.data.RegisterRequest
import com.bproperties.app.data.User
import kotlinx.coroutines.launch

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import com.bproperties.app.data.FavoriteRequest
import com.bproperties.app.utils.SessionManager

class AuthViewModel(application: Application) : AndroidViewModel(application) {
    private val api = BPropertiesApi.create()
    private val sessionManager = SessionManager(application)

    var currentUser by mutableStateOf<User?>(null)
        private set

    var loading by mutableStateOf(false)
        private set

    var error by mutableStateOf<String?>(null)
        private set

    init {
        val token = sessionManager.fetchAuthToken()
        if (token != null) {
            BPropertiesApi.setToken(token)
            currentUser = sessionManager.getUser()
        }
    }

    fun login(email: String, password: String, onSuccess: () -> Unit) {
        viewModelScope.launch {
            loading = true
            error = null
            try {
                val response = api.login(LoginRequest(email, password))
                currentUser = response.user
                BPropertiesApi.setToken(response.token)
                sessionManager.saveAuthToken(response.token)
                sessionManager.saveUser(response.user.id, response.user.name, response.user.email, response.user.role)
                onSuccess()
            } catch (e: Exception) {
                error = "Login failed: ${e.message}"
                e.printStackTrace()
            } finally {
                loading = false
            }
        }
    }

    fun register(name: String, email: String, password: String, onSuccess: () -> Unit) {
        viewModelScope.launch {
            loading = true
            error = null
            try {
                val response = api.register(RegisterRequest(name, email, password))
                currentUser = response.user
                BPropertiesApi.setToken(response.token)
                sessionManager.saveAuthToken(response.token)
                sessionManager.saveUser(response.user.id, response.user.name, response.user.email, response.user.role)
                onSuccess()
            } catch (e: Exception) {
                error = "Registration failed: ${e.message}"
                e.printStackTrace()
            } finally {
                loading = false
            }
        }
    }
    
    fun logout() {
        currentUser = null
        BPropertiesApi.setToken(null)
        sessionManager.clearAuthToken()
        sessionManager.clearUser()
    }
}
