package com.bproperties.app.utils

import android.content.Context
import android.content.SharedPreferences

class SessionManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("user_session", Context.MODE_PRIVATE)

    fun saveAuthToken(token: String) {
        val editor = prefs.edit()
        editor.putString("auth_token", token)
        editor.apply()
    }

    fun fetchAuthToken(): String? {
        return prefs.getString("auth_token", null)
    }
    
    fun clearAuthToken() {
        prefs.edit().remove("auth_token").apply()
    }

    fun saveUser(id: String, name: String, email: String, role: String) {
        val editor = prefs.edit()
        editor.putString("user_id", id)
        editor.putString("user_name", name)
        editor.putString("user_email", email)
        editor.putString("user_role", role)
        editor.apply()
    }

    fun clearUser() {
        val editor = prefs.edit()
        editor.remove("user_id")
        editor.remove("user_name")
        editor.remove("user_email")
        editor.remove("user_role")
        editor.apply()
    }
    fun getUser(): com.bproperties.app.data.User? {
        val id = prefs.getString("user_id", null)
        val name = prefs.getString("user_name", null)
        val email = prefs.getString("user_email", null)
        val role = prefs.getString("user_role", null)

        return if (id != null && name != null && email != null && role != null) {
            com.bproperties.app.data.User(id, name, email, role)
        } else {
            null
        }
    }
}
