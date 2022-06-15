﻿namespace Instool.DAL.Models.Auth
{
    public class Role
    {
        public static readonly int RoleAdmin = 1;

        public static readonly int RoleCommunity = 2;

        public int RoleId { get; set; }
        public string Name { get; set; }

        public IEnumerable<RolePrivilege> Privileges { get; set; } = new List<RolePrivilege>();

        //public IEnumerable<Collaborator> Collaborators { get; set; } = new List<Collaborator>();

        public Role()
        {
            Name = null!;
        }

    }
}
