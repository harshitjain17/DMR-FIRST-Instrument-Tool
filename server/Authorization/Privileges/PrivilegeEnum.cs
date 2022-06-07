using System;
using System.ComponentModel.DataAnnotations;

namespace Instool.Authorization.Privileges
{
    public enum PrivilegeEnum : short
    {
        // ************ Customizing *****************
        [Display(GroupName = "Customizing", Name = "InstrumentType", Description = "Instrument Types (aka techniques)")]
        [AvailableOperations("crud")]
        InstrumentType = 10,

        // ************ Data *****************
        [Display(GroupName = "Data", Name = "Instrument", Description = "Instrument")]
        [AvailableOperations("crud")]
        Instrument = 20,

        [Display(GroupName = "Data", Name = "Award", Description = "NSF Award")]
        [AvailableOperations("crud")]
        Award = 21,

        [Display(GroupName = "Data", Name = "Publication", Description = "Publications")]
        [AvailableOperations("crud")]
        Publication = 22,
    }
}
