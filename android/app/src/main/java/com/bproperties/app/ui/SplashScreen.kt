package com.bproperties.app.ui

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import com.bproperties.app.R
import kotlinx.coroutines.delay
import com.bproperties.app.ui.theme.DeepBlack

@Composable
fun SplashScreen(
    onNavigateToNext: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepBlack),
        contentAlignment = Alignment.Center
    ) {
        Image(
            painter = painterResource(id = R.drawable.splash_image),
            contentDescription = "Splash Screen",
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop // Or Fit depending on the image
        )
        // Or if it's a logo on black:
        // Image(painter = painterResource(id = R.drawable.logo), ...)
        
        LaunchedEffect(Unit) {
            delay(2000) // 2 seconds delay
            onNavigateToNext()
        }
    }
}
