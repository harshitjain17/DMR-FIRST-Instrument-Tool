using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Instool.DAL.Models
{
    public class InstoolContext : DbContext, IDataProtectionKeyContext
    {
        public InstoolContext()
        {
        }

        public InstoolContext(DbContextOptions<InstoolContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Award> Awards { get; set; } = null!;
        public virtual DbSet<Institution> Institutions { get; set; } = null!;
        public virtual DbSet<Instrument> Instruments { get; set; } = null!;
        public virtual DbSet<InstrumentCapability> InstrumentCapabilities { get; set; } = null!;
        public virtual DbSet<InstrumentContact> InstrumentContacts { get; set; } = null!;
        public virtual DbSet<InstrumentType> InstrumentTypes { get; set; } = null!;
        public virtual DbSet<Investigator> Investigators { get; set; } = null!;
        public virtual DbSet<InvestigatorOnAward> InvestigatorOnAwards { get; set; } = null!;
        public virtual DbSet<Location> Locations { get; set; } = null!;
        public virtual DbSet<Publication> Publications { get; set; } = null!;

        public DbSet<DataProtectionKey> DataProtectionKeys { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Award>(entity =>
            {
                entity.ToTable("Award");

                entity.HasIndex(e => e.AwardNumber, "UK_Award_Number")
                    .IsUnique();

                entity.Property(e => e.AwardId).HasColumnName("AwardID");

                entity.Property(e => e.AwardNumber)
                    .HasMaxLength(25)
                    .IsUnicode(false);

                entity.Property(e => e.EndDate).HasColumnType("datetime");

                entity.Property(e => e.StartDate).HasColumnType("datetime");

                entity.Property(e => e.Title)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Institution>(entity =>
            {
                entity.ToTable("Institution");

                entity.Property(e => e.InstitutionId).HasColumnName("InstitutionID");

                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Instrument>(entity =>
            {
                entity.ToTable("Instrument");

                entity.Property(e => e.InstrumentId).HasColumnName("InstrumentID");

                entity.Property(e => e.AcquisitionDate).HasColumnType("date");

                entity.Property(e => e.CompletionDate).HasColumnType("date");

                entity.Property(e => e.Description).IsUnicode(false);

                entity.Property(e => e.Doi)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.InstitutionId).HasColumnName("InstitutionID");

                entity.Property(e => e.LocationId).HasColumnName("LocationID");

                entity.Property(e => e.Manufacturer)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ModelNumber)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ReplacedById).HasColumnName("ReplacedByID");

                entity.Property(e => e.RoomNumber)
                    .HasMaxLength(25)
                    .IsUnicode(false);

                entity.Property(e => e.SerialNumber)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Status)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.HasOne(d => d.Location)
                    .WithMany(p => p.Instruments)
                    .HasForeignKey(d => d.LocationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Instrument_Location");

                entity.HasOne(d => d.Institution)
                    .WithMany(p => p.Instruments)
                    .HasForeignKey(d => d.InstitutionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Instrument_Institution");

                entity.HasOne(d => d.ReplacedBy)
                    .WithMany(p => p.Replaces)
                    .HasForeignKey(d => d.ReplacedById)
                    .HasConstraintName("FK_Instrument_NewVersion");

                entity.HasMany(d => d.Awards)
                    .WithMany(p => p.Instruments)
                    .UsingEntity<Dictionary<string, object>>(
                        "InstrumentAward",
                        l => l.HasOne<Award>().WithMany().HasForeignKey("AwardId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_InstrumentAward_Award"),
                        r => r.HasOne<Instrument>().WithMany().HasForeignKey("InstrumentId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_InstrumentAward_Instrument"),
                        j =>
                        {
                            j.HasKey("InstrumentId", "AwardId");

                            j.ToTable("InstrumentAward");

                            j.IndexerProperty<int>("InstrumentId").HasColumnName("InstrumentID");

                            j.IndexerProperty<int>("AwardId").HasColumnName("AwardID");
                        });

                entity.HasMany(d => d.Publications)
                    .WithMany(p => p.Instruments)
                    .UsingEntity<Dictionary<string, object>>(
                        "PublicationInstrument",
                        l => l.HasOne<Publication>().WithMany().HasForeignKey("PublicationId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_PublicationInstrument_Publication"),
                        r => r.HasOne<Instrument>().WithMany().HasForeignKey("InstrumentId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_PublicationInstrument_Instrument"),
                        j =>
                        {
                            j.HasKey("InstrumentId", "PublicationId");

                            j.ToTable("PublicationInstrument");

                            j.IndexerProperty<int>("InstrumentId").HasColumnName("InstrumentID");

                            j.IndexerProperty<int>("PublicationId").HasColumnName("PublicationID");
                        });
            });

            modelBuilder.Entity<InstrumentCapability>(entity =>
            {
                entity.ToTable("InstrumentCapability");

                entity.Property(e => e.InstrumentCapabilityId).HasColumnName("InstrumentCapabilityID");

                entity.Property(e => e.InstrumentId).HasColumnName("InstrumentID");

                entity.Property(e => e.Name).IsUnicode(false);

                //entity.HasOne(d => d.Instrument)
                //    .WithMany(p => p.InstrumentCapabilities)
                //    .HasForeignKey(d => d.InstrumentId)
                //    .OnDelete(DeleteBehavior.ClientSetNull)
                //    .HasConstraintName("FK_InstrumentCapability_Instrument");
            });

            modelBuilder.Entity<InstrumentContact>(entity =>
            {
                entity.HasKey(e => new { e.InvestigatorId, e.InstrumentId });

                entity.ToTable("InstrumentContact");

                entity.Property(e => e.InvestigatorId).HasColumnName("InvestigatorID");

                entity.Property(e => e.InstrumentId).HasColumnName("InstrumentID");

                entity.Property(e => e.Role)
                    .HasMaxLength(1)
                    .IsUnicode(false);

                entity.HasOne(d => d.Instrument)
                    .WithMany(p => p.InstrumentContacts)
                    .HasForeignKey(d => d.InstrumentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_InstrumentContact_Instrument");

                entity.HasOne(d => d.Investigator)
                    .WithMany(p => p.InstrumentContacts)
                    .HasForeignKey(d => d.InvestigatorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_InstrumentContact_Investigator");
            });

            modelBuilder.Entity<InstrumentType>(entity =>
            {
                entity.ToTable("InstrumentType");

                entity.Property(e => e.InstrumentTypeId).HasColumnName("InstrumentTypeID");

                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Uri)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.InverseCategory)
                    .HasForeignKey(d => d.CategoryId)
                    .HasConstraintName("FK_InstrumentType_InstrumentType");

                entity.HasMany(d => d.Instruments)
                    .WithMany(p => p.InstrumentTypes)
                    .UsingEntity<Dictionary<string, object>>(
                        "InstrumentInstrumentType",
                        l => l.HasOne<Instrument>().WithMany().HasForeignKey("InstrumentId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_InstrumentInstrumentType_Instrument"),
                        r => r.HasOne<InstrumentType>().WithMany().HasForeignKey("InstrumentTypeId").OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("FK_InstrumentInstrumentType_InstrumentType"),
                        j =>
                        {
                            j.HasKey("InstrumentTypeId", "InstrumentId");

                            j.ToTable("InstrumentInstrumentType");

                            j.IndexerProperty<int>("InstrumentTypeId").HasColumnName("InstrumentTypeID");

                            j.IndexerProperty<int>("InstrumentId").HasColumnName("InstrumentID");
                        });
            });

            modelBuilder.Entity<Investigator>(entity =>
            {
                entity.ToTable("Investigator");

                entity.HasIndex(e => e.Eppn, "UK_Investigator_Eppn")
                    .IsUnique();

                entity.Property(e => e.InvestigatorId).HasColumnName("InvestigatorID");

                entity.Property(e => e.Email)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Eppn)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.FirstName)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.LastName)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.MiddleName)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Phone)
                    .HasMaxLength(25)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<InvestigatorOnAward>(entity =>
            {
                entity.HasKey(e => new { e.InvestigatorId, e.AwardId });

                entity.ToTable("InvestigatorOnAward");

                entity.Property(e => e.InvestigatorId).HasColumnName("InvestigatorID");

                entity.Property(e => e.AwardId).HasColumnName("AwardID");

                entity.Property(e => e.Role)
                    .HasMaxLength(1)
                    .IsUnicode(false);

                entity.HasOne(d => d.Award)
                    .WithMany(p => p.InvestigatorOnAwards)
                    .HasForeignKey(d => d.AwardId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_InvestigatorOnAward_Award");

                entity.HasOne(d => d.Investigator)
                    .WithMany(p => p.InvestigatorOnAwards)
                    .HasForeignKey(d => d.InvestigatorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_InvestigatorOnAward_Investigator");
            });

            modelBuilder.Entity<Location>(entity =>
            {
                entity.ToTable("Location");

                entity.Property(e => e.LocationId).HasColumnName("LocationID");

                entity.Property(e => e.Building)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.City)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Country)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.State)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Street)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Zip)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Publication>(entity =>
            {
                entity.ToTable("Publication");

                entity.HasIndex(e => e.Doi, "UK_Publication_DOI")
                    .IsUnique();

                entity.Property(e => e.PublicationId).HasColumnName("PublicationID");

                entity.Property(e => e.Authors)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Doi)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("DOI");

                entity.Property(e => e.Journal)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Title)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

        }
    }
}
