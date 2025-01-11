from PIL import Image
import json
import os

def generate_app_icons(source_image_path, output_dir):
    """
    生成iOS应用所需的所有尺寸的图标
    
    Args:
        source_image_path: 源图片路径(建议使用1024x1024的PNG图片)
        output_dir: 输出目录路径
    """
    # 确保输出目录存在
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # 读取源图片
    source_image = Image.open(source_image_path)
    
    # 完整的Contents.json配置
    contents = {
        "images": [
            {"size": "20x20", "idiom": "iphone", "filename": "icon-20@2x.png", "scale": "2x"},
            {"size": "20x20", "idiom": "iphone", "filename": "icon-20@3x.png", "scale": "3x"},
            {"size": "29x29", "idiom": "iphone", "filename": "icon-29.png", "scale": "1x"},
            {"size": "29x29", "idiom": "iphone", "filename": "icon-29@2x.png", "scale": "2x"},
            {"size": "29x29", "idiom": "iphone", "filename": "icon-29@3x.png", "scale": "3x"},
            {"size": "40x40", "idiom": "iphone", "filename": "icon-40@2x.png", "scale": "2x"},
            {"size": "40x40", "idiom": "iphone", "filename": "icon-40@3x.png", "scale": "3x"},
            {"size": "57x57", "idiom": "iphone", "filename": "icon-57.png", "scale": "1x"},
            {"size": "57x57", "idiom": "iphone", "filename": "icon-57@2x.png", "scale": "2x"},
            {"size": "60x60", "idiom": "iphone", "filename": "icon-60@2x.png", "scale": "2x"},
            {"size": "60x60", "idiom": "iphone", "filename": "icon-60@3x.png", "scale": "3x"},
            {"size": "20x20", "idiom": "ipad", "filename": "icon-20-ipad.png", "scale": "1x"},
            {"size": "20x20", "idiom": "ipad", "filename": "icon-20@2x-ipad.png", "scale": "2x"},
            {"size": "29x29", "idiom": "ipad", "filename": "icon-29-ipad.png", "scale": "1x"},
            {"size": "29x29", "idiom": "ipad", "filename": "icon-29@2x-ipad.png", "scale": "2x"},
            {"size": "40x40", "idiom": "ipad", "filename": "icon-40.png", "scale": "1x"},
            {"size": "40x40", "idiom": "ipad", "filename": "icon-40@2x.png", "scale": "2x"},
            {"size": "50x50", "idiom": "ipad", "filename": "icon-50.png", "scale": "1x"},
            {"size": "50x50", "idiom": "ipad", "filename": "icon-50@2x.png", "scale": "2x"},
            {"size": "72x72", "idiom": "ipad", "filename": "icon-72.png", "scale": "1x"},
            {"size": "72x72", "idiom": "ipad", "filename": "icon-72@2x.png", "scale": "2x"},
            {"size": "76x76", "idiom": "ipad", "filename": "icon-76.png", "scale": "1x"},
            {"size": "76x76", "idiom": "ipad", "filename": "icon-76@2x.png", "scale": "2x"},
            {"size": "83.5x83.5", "idiom": "ipad", "filename": "icon-83.5@2x.png", "scale": "2x"},
            {"size": "1024x1024", "idiom": "ios-marketing", "filename": "icon-1024.png", "scale": "1x"}
        ],
        "info": {
            "version": 1,
            "author": "icon.generator"
        }
    }
    
    # 生成所有尺寸的图标
    for image_spec in contents["images"]:
        # 解析尺寸
        base_size = tuple(map(float, image_spec["size"].split("x")))
        scale = int(image_spec["scale"][0])
        
        # 计算实际尺寸
        target_size = tuple(int(x * scale) for x in base_size)
        
        # 调整图片大小
        resized_image = source_image.resize(target_size, Image.Resampling.LANCZOS)
        
        # 保存图片
        output_path = os.path.join(output_dir, image_spec["filename"])
        resized_image.save(output_path, "PNG")
    
    # 保存Contents.json
    with open(os.path.join(output_dir, "Contents.json"), "w", encoding="utf-8") as f:
        json.dump(contents, f, indent=4)

def convert_to_jpg(png_path):
    """
    将PNG图片转换为JPG格式
    
    Args:
        png_path: PNG图片路径
    Returns:
        转换后的JPG图片对象
    """
    # 打开PNG图片
    png_image = Image.open(png_path)
    # 如果图片有透明通道，需要先转换为RGB
    if png_image.mode in ('RGBA', 'LA') or (png_image.mode == 'P' and 'transparency' in png_image.info):
        background = Image.new('RGB', png_image.size, (255, 255, 255))
        background.paste(png_image, mask=png_image.split()[-1] if png_image.mode == 'RGBA' else None)
        return background
    return png_image.convert('RGB')

if __name__ == "__main__":
    source_image_path = "/Volumes/L/flutter_app_2025/20240103-swiftt/zl/logo.png"
    output_dir = "/Users/admin/Desktop/python工具/生成icon/AppIcon.appiconset"
    
    # 先转换为JPG
    jpg_image = convert_to_jpg(source_image_path)
    
    # 创建临时文件路径用于保存JPG
    temp_jpg_path = os.path.join(os.path.dirname(source_image_path), "temp_icon.jpg")
    jpg_image.save(temp_jpg_path, "JPEG", quality=95)
    
    # 使用转换后的JPG生成图标
    generate_app_icons(temp_jpg_path, output_dir)
    
    # 清理临时文件
    os.remove(temp_jpg_path)
    
    print(f"图标已生成到目录: {output_dir}")
