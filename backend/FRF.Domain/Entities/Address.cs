﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Domain.Entities
{
    public class Address
    {
        public Guid Id { get; set; }
        public string Number { get; set; } = String.Empty;
        public string Street { get; set; } = String.Empty;
        public string City { get; set; } = String.Empty;
        public string State { get; set; } = String.Empty;
        public string ZipCode { get; set; } = String.Empty;
    }
}
