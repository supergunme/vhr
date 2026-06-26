package org.javaboy.vhr.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 将本地磁盘的头像上传目录映射为可访问的静态资源，替代原 FastDFS 存储。
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String userfaceDir = System.getProperty("user.dir") + "/userface/";
        registry.addResourceHandler("/userface/**")
                .addResourceLocations("file:" + userfaceDir);
    }
}
