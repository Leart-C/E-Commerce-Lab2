using AutoMapper;
using backend.Core.Dtos.Product;
using backend.Core.Entities;

namespace backend.Core.Mapper
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            CreateMap<ProductCreateDto, Product>();
        }
    }
}
