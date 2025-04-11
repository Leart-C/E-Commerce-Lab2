using AutoMapper;
using backend.Core.Dtos.Category.backend.Core.Dto;
using backend.Core.Dtos.Order;
using backend.Core.Dtos.Product;
using backend.Core.Dtos.ProductReview;
using backend.Core.Dtos.ShippingAddress;
using backend.Core.Entities;

namespace backend.Core.Mapper
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            CreateMap<ProductCreateDto, Product>();
            CreateMap<ProductReviewCreateDto, ProductReview>();
            CreateMap<CategoryDto, Category>().ReverseMap();
            CreateMap<Order, OrderDto>().ReverseMap();
            CreateMap<ShippingAddress, ShippingAddressDto>().ReverseMap();
        }
    }
}
