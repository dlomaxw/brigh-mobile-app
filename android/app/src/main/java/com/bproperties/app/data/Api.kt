package com.bproperties.app.data

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Path

data class LeadRequest(
    val propertyId: String,
    val name: String,
    val email: String,
    val phone: String,
    val message: String
)

data class LeadResponse(
    val status: String
)

data class Lead(
    val id: String,
    val name: String,
    val email: String,
    val phone: String,
    val message: String,
    val propertyId: String?,
    val property: LeadProperty?
)

data class LeadProperty(
    val title: String
)

data class LoginRequest(val email: String, val password: String)

data class RegisterRequest(val name: String, val email: String, val password: String)

data class AuthResponse(val token: String, val user: User)

data class User(val id: String, val name: String, val email: String, val role: String)

data class PropertyRequest(
    val title: String,
    val description: String,
    val price: String,
    val type: String,
    val status: String,
    val city: String,
    val bedrooms: Int,
    val bathrooms: Int,
    val sizeSqm: Double,
    val unitTypes: String? = null,
    val media: List<MediaRequest>? = null
)

data class MediaRequest(val url: String, val type: String = "IMAGE")


interface BPropertiesApi {
    @retrofit2.http.POST("auth/login")
    suspend fun login(@retrofit2.http.Body request: LoginRequest): AuthResponse

    @retrofit2.http.POST("auth/register")
    suspend fun register(@retrofit2.http.Body request: RegisterRequest): AuthResponse

    @GET("properties")
    suspend fun getProperties(
        @retrofit2.http.Query("search") search: String? = null,
        @retrofit2.http.Query("type") type: String? = null
    ): List<Property>

    @GET("properties/{id}")
    suspend fun getProperty(@Path("id") id: String): Property

    @retrofit2.http.POST("leads")
    suspend fun createLead(@retrofit2.http.Body lead: LeadRequest): LeadResponse

    @retrofit2.http.POST("favorites/toggle")
    suspend fun toggleFavorite(@retrofit2.http.Body request: FavoriteRequest): FavoriteResponse

    @GET("favorites")
    suspend fun getFavorites(): List<Property>

    @GET("leads")
    suspend fun getLeads(): List<Lead>

    @retrofit2.http.POST("properties")
    suspend fun createProperty(@retrofit2.http.Body request: PropertyRequest): Property

    @retrofit2.http.PUT("properties/{id}")
    suspend fun updateProperty(@Path("id") id: String, @retrofit2.http.Body request: PropertyRequest): Property

    @retrofit2.http.DELETE("properties/{id}")
    suspend fun deleteProperty(@Path("id") id: String): Unit


    companion object {
        // TODO: Replace with your Vercel URL, e.g. "https://your-app-name.vercel.app/api/"
        // private const val BASE_URL = "http://10.0.2.2:5000/api/" // Localhost
        private const val BASE_URL = "https://CHANGE_ME.vercel.app/api/"
        private var authToken: String? = null

        fun setToken(token: String?) {
            authToken = token
        }

        fun create(): BPropertiesApi {
            val client = okhttp3.OkHttpClient.Builder()
                .addInterceptor { chain ->
                    val original = chain.request()
                    val requestBuilder = original.newBuilder()
                    authToken?.let {
                        requestBuilder.header("Authorization", "Bearer $it")
                    }
                    chain.proceed(requestBuilder.build())
                }
                .build()

            val retrofit = Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
            return retrofit.create(BPropertiesApi::class.java)
        }
    }
}

data class FavoriteRequest(val propertyId: String)
data class FavoriteResponse(val message: String, val isFavorite: Boolean)
