package com.bproperties.app.data

data class Property(
    val id: String,
    val title: String,
    val description: String,
    val price: String,
    val type: String,
    val status: String,
    val city: String,
    val area: String,
    val sizeSqm: Double?,
    val bedrooms: Int?,
    val bathrooms: Int?,
    val parking: Int?,
    val unitTypes: String?,
    val latitude: Double?,
    val longitude: Double?,
    val media: List<PropertyMedia>? = null
)

data class PropertyMedia(
    val id: String,
    val url: String,
    val type: String // IMAGE, VIDEO
)
